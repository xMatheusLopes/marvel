import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  public publicKey: string;
  public privateKey: string;
  public apiUrl: string;
  public ts: string;
  public hash: string;

  constructor() {
    this.publicKey = 'a0cb29802acbe40512ba2cbfd087e1d5';
    this.privateKey = '1b971589a94da83558cdcf1eb9e264561c0cd2ff';
    this.ts = 'thesoer';
    this.apiUrl = 'https://gateway.marvel.com/v1/public';
    this.hash = 'cb744a039fc4955aa10067fbcda2572c';
  }

  mountUrl(resource: string) {
    return `${this.apiUrl}/${resource}?ts=${this.ts}&apikey=${this.publicKey}&hash=${this.hash}`;
  }
}
