export interface UploadResp {
  resp: {
    message: string;
    raw: File;
    successData: {
      Location: string;
      statusCode: number;
    };
  };
}