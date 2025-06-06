declare module 'expo-camera' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface CameraCapturedPicture {
    uri: string;
    width: number;
    height: number;
    base64?: string;
  }

  export interface CameraProps extends ViewProps {
    type?: 'front' | 'back';
    ref?: React.RefObject<Camera>;
  }

  export class Camera extends Component<CameraProps> {
    takePictureAsync(options?: {
      quality?: number;
      base64?: boolean;
    }): Promise<CameraCapturedPicture>;
  }

  export function requestCameraPermissionsAsync(): Promise<{
    status: 'granted' | 'denied';
    granted: boolean;
  }>;
} 