export interface CameraLocation {
    camera_id: string;
    latitude: number | null;
    longitude: number | null;
}

export interface CameraLocations {
    [address: string]: CameraLocation;
} 