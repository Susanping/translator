//
//  WhisperModule.swift
//  VoSnap
//
//  Created by Hacker Gavin on 2025/6/14.
//

import Foundation
import AVFoundation

@objc(WhisperModule)
class WhisperModule: NSObject, AVAudioRecorderDelegate {
  private var model: OpaquePointer?
  private var audioRecorder: AVAudioRecorder?
  private var recordingURL: URL?
  private var callback: RCTResponseSenderBlock?

  // 加载模型
  @objc func loadModel(_ modelPath: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    guard let modelURL = Bundle.main.url(forResource: modelPath, withExtension: nil) else {
      reject("ERROR", "Model file not found", nil)
      return
    }
    
    model = whisper_init_from_file(modelURL.path)
    if model != nil {
      resolve(true)
    } else {
      reject("ERROR", "Failed to load model", nil)
    }
  }

  // 开始录音
  @objc func startRecording(_ callback: @escaping RCTResponseSenderBlock) {
    self.callback = callback
    
    let audioSession = AVAudioSession.sharedInstance()
    do {
      try audioSession.setCategory(.record, mode:.measurement, options: [])
      try audioSession.setActive(true)
      
      let documentsDirectory = FileManager.default.urls(for:.documentDirectory, in:.userDomainMask)[0]
      recordingURL = documentsDirectory.appendingPathComponent("recording.wav")
      
      let settings = [
        AVFormatIDKey: Int(kAudioFormatLinearPCM),
        AVSampleRateKey: 16000, // Whisper 要求 16kHz
        AVNumberOfChannelsKey: 1,
        AVEncoderBitRateKey: 128000,
        AVLinearPCMIsFloatKey: false
      ]
      
      audioRecorder = try AVAudioRecorder(url: recordingURL!, settings: settings)
      audioRecorder?.delegate = self
      audioRecorder?.record()
      callback([true])
    } catch {
      callback([false, error.localizedDescription])
    }
  }

  // 停止录音并转录
  @objc func stopRecordingAndTranscribe(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    audioRecorder?.stop()
    
    guard let model = model, let recordingURL = recordingURL else {
      rejecter("ERROR", "Model or recording not initialized", nil)
      return
    }
    
    // 音频处理和转录逻辑
    DispatchQueue.global(qos:.userInitiated).async {
      do {
        // 加载音频文件并转换为 Whisper 格式
        let audioData = try Data(contentsOf: recordingURL)
        let transcription = self.transcribeAudio(audioData, model: model)
        DispatchQueue.main.async {
          resolver(transcription)
        }
      } catch {
        DispatchQueue.main.async {
          rejecter("ERROR", error.localizedDescription, nil)
        }
      }
    }
  }

  // 实际转录方法
  private func transcribeAudio(_ audioData: Data, model: OpaquePointer) -> String {
    // 将音频数据转换为 Whisper 所需的格式
    // 此处简化处理，实际需实现 PCM 数据转换和特征提取
    let ctx = whisper_init_from_file("path/to/whisper/model")
    defer { whisper_free(ctx) }
    
    // 设置转录参数
    var params = whisper_full_default_params(WHISPER_SAMPLING_GREEDY)
    params.language = "en"
    params.translate = false
    params.n_threads = min(4, ProcessInfo.processInfo.activeProcessorCount)
    
    // 执行转录
    let result = whisper_full(ctx, params, audioData.bytes.assumingMemoryBound(to: Float.self), audioData.count / MemoryLayout<Float>.size)
    if result != 0 {
      return "Transcription failed"
    }
    
    // 提取转录文本
    let n_segments = whisper_full_n_segments(ctx)
    var transcription = ""
    for i in 0..<n_segments {
      let text = whisper_full_get_segment_text(ctx, i)
      transcription += String(cString: text)
    }
    
    return transcription
  }
}
