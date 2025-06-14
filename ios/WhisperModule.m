//
//  WhisperModule.m
//  myapp
//
//  Created by Hacker Gavin on 2025/6/14.
//

#import "WhisperModule.h"
#import <React/RCTBridgeModule.h>

@implementation WhisperModule

RCT_EXPORT_MODULE(WhisperModule);

// 导出方法到 JavaScript
RCT_EXPORT_METHOD(loadModel:(NSString *)modelPath
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [self loadModel:modelPath resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(startRecording:(RCTResponseSenderBlock)callback) {
  [self startRecording:callback];
}

RCT_EXPORT_METHOD(stopRecordingAndTranscribe:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [self stopRecordingAndTranscribe:resolve rejecter:reject];
}

@end
