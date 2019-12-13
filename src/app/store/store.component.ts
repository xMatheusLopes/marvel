import { Component, OnInit } from '@angular/core';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  settings = {
    isLoading: true,
    isStoriesLoading: false,
    stories: [],
    characters: [],
    selectedChar: null,
    cartItems: new Map()
  };
  constructor(
    private storeService: StoreService,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar ) { }

  ngOnInit() {
    this._loadSeries();
  }

  private _loadSeries() {
    this.settings.isLoading = true;
    this.httpClient.get(this.storeService.mountUrl('characters')).subscribe(
      (Response) => {
        this.handleCharacters(Response);
      }, error => {
        this.handleError(error);
      }
    );
  }

  public loadCharacterStories() {
    this.settings.isStoriesLoading = true;
    this.settings.stories = [];
    this.httpClient.get(this.storeService.mountUrl(`characters/${this.settings.selectedChar.id}/stories`)).subscribe(
      (Response) => {
        this.handleStories(Response);
      }, error => {
        this.handleError(error);
      }
    );
  }

  handleCharacters(data: any) {
    this.settings.isLoading = false;
    this.settings.characters = data.data.results;
  }

  handleStories(data: any) {
    this.settings.isStoriesLoading = false;
    this.settings.stories = data.data.results;
  }

  handleError(error: any) {
    this.settings.isLoading = false;
    this.snackBar.open('Ops, não foi possível se conectar com o servidor', null, {
      duration: 5000
    });
  }

  addToCart(item: any, value: number) {
    const itemCart = this.settings.cartItems.has(item.id);
    const quantity = itemCart ? this.settings.cartItems.get(item.id).quantity + 1 : 1;
    this.settings.cartItems.set(item.id, {item, value, quantity});
  }

}
