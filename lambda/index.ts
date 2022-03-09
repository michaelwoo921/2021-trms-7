import { Trms } from './trms.service';
import trmsService from './trms.service';
import createResponse from './response';

interface Event {
  httpMethod: string;
  path: string;
  body?: string;
}

export async function handler(event: Event) {
  const parts = event.path.split('/trmss')[1];
  if (parts.includes('/')) {
    const [_, name, dt] = parts.split('/');

    let trms: Trms | null;
    switch (event.httpMethod) {
      case 'GET':
        trms = await trmsService.getTrms(name, dt);
        if (trms) {
          return createResponse(trms, 200);
        } else {
          return createResponse({}, 404);
        }
        break;
      case 'DELETE':
        let b: Boolean;
        b = await trmsService.deleteTrms(name, dt);
        if (b) {
          return createResponse('item deleted', 200);
        } else {
          return createResponse('item not found', 404);
        }
        break;
      default:
        return createResponse('method not supported', 404);
    }
  } else {
    let trms: Trms[];
    let b: Boolean;
    switch (event.httpMethod) {
      case 'GET':
        trms = await trmsService.getTrmss();
        if (trms) {
          return createResponse(trms, 200);
        } else {
          return createResponse('', 404);
        }
        break;

      case 'POST':
        b = await trmsService.addTrms(JSON.parse(event.body as string) as Trms);
        if (b) {
          return createResponse('created item', 200);
        } else {
          return createResponse('', 404);
        }
        break;

      case 'PUT':
        b = await trmsService.updateTrms(
          JSON.parse(event.body as string) as Trms
        );
        if (b) {
          return createResponse('updated item', 200);
        } else {
          return createResponse('', 404);
        }
        break;

      default:
        return createResponse('', 404);
    }
  }
}
