// // src/campaign/campaign.gateway.ts
// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { GangnamRestaurantService } from './services/gangnam-restaurant.service';

// @WebSocketGateway({
//   cors: {
//     origin: '*', // 클라이언트와의 CORS 허용
//   },
// })
// export class CampaignGateway {
//   @WebSocketServer() server: Server;

//   constructor(private readonly gangnamService: GangnamRestaurantService) {}

//   @SubscribeMessage('requestCampaignData')
//   async handleCampaignDataRequest(
//     client: Socket,
//     @MessageBody() search: string,
//   ) {
//     console.log('클라이언트 요청 받음:', search);

//     // 첫 번째 데이터 전송
//     const firstData = await this.gangnamService.getGangnamRestaurants(search);
//     client.emit('campaignData', firstData);

//     // 두 번째 데이터 전송 (비동기적 처리)
//     const additionalData =
//       await this.gangnamService.getAdditionalGangnamRestaurants(search);
//     client.emit('campaignData', additionalData);
//   }
// }

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // 또는 특정 도메인 설정: 'http://localhost:3000'
    methods: ['GET', 'POST'],
  },
})
export class CampaignGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('requestCampaignData')
  handleCampaignRequest(@MessageBody() searchQuery: string): void {
    console.log('Received search query:', searchQuery);
    // 캠페인 데이터를 반환 (임의로 예시 데이터)
    this.server.emit('campaignData', [
      { id: 1, name: 'Campaign 1' },
      { id: 2, name: 'Campaign 2' },
    ]);
  }
}
