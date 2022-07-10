import { Controller, Get, Path, Route } from 'tsoa';

@Route('metadata')
export class MetadataController extends Controller {
  @Get('{trackId}')
  public async getTrack(@Path() trackId: string): Promise<unknown> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(trackId);
      }, 1000);
    });
  }
}
