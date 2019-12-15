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
    cartItems: new Map(),
    finished: false,
    gridCols: 0
  };
  constructor(
    private storeService: StoreService,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar ) { }

  ngOnInit() {
    this.onResize();
    this._loadCharacters();
  }

  /**
   * Carrega os personagens
   */
  private _loadCharacters() {
    this.settings.isLoading = true;
    this.httpClient.get(this.storeService.mountUrl('characters')).subscribe(
      (Response) => {
        this.handleCharacters(Response);
      }, error => {
        this.handleError();
      }
    );
  }

  /**
   * Carrega os quadrinhos
   */
  public loadCharacterStories() {
    this.settings.isStoriesLoading = true;
    this.settings.stories = [];
    this.httpClient.get(this.storeService.mountUrl(`characters/${this.settings.selectedChar.id}/stories`)).subscribe(
      (Response) => {
        this.handleStories(Response);
      }, error => {
        this.handleError();
      }
    );
  }

  /**
   * Manipula os personagens
   * @param data dados de resposta da api (personagens)
   */
  handleCharacters(data: any) {
    this.settings.isLoading = false;
    this.settings.characters = data.data.results;
  }

  /**
   * Manipulações de quadrinhos
   * @param data dados de resposta da api (quadrinhos)
   */
  handleStories(data: any) {
    this.settings.isStoriesLoading = false;
    this.settings.stories = data.data.results;
  }

  /**
   * Coloca um toast que deu um erro no servidor
   */
  handleError() {
    this.settings.isLoading = false;
    this.snackBar.open('Ops, não foi possível se conectar com o servidor', null, {
      duration: 5000
    });
  }

  /**
   * Adiciona um item ao carrinho
   * @param item item a ser adicionado no carrinho
   * @param value valor do item a ser adicionado no carrinho
   */
  addToCart(item: any, value: number) {
    this.settings.finished = false;
    const itemCart = this.settings.cartItems.has(item.id);
    const quantity = itemCart ? this.settings.cartItems.get(item.id).quantity + 1 : 1;
    this.settings.cartItems.set(item.id, {item, value, quantity});
  }

  /**
   * Converte os items de map para array
   */
  itemsCartToArray() {
    return Array.from(this.settings.cartItems.values());
  }

  /**
   * Pega o valor total de cada item do carrinho
   * @param value valor individual do item
   * @param quantity quantidade individual do item
   */
  getItemTotalPrice(value: number, quantity: number) {
    return (value * quantity).toFixed(2);
  }

  /**
   * Acrescenta um item no carrinho
   * @param itemID id do item do carrinho
   */
  addItem(itemID: string) {
    const item = this.settings.cartItems.get(itemID);
    item.quantity++;
    this.settings.cartItems.set(itemID, item);
  }

  /**
   * Remove um item do carrinho
   * @param itemID id do item do carrinho
   */
  removeItem(itemID: string) {
    const item = this.settings.cartItems.get(itemID);
    item.quantity--;
    if (item.quantity > 0) {
      this.settings.cartItems.set(itemID, item);
    } else {
      this.settings.cartItems.delete(itemID);
    }
  }

  /**
   * Pega o total da compra
   */
  getTotalPrice() {
    let total = 0;
    this.settings.cartItems.forEach(item => {
      total += parseFloat(this.getItemTotalPrice(item.value, item.quantity));
    });

    return total.toFixed(2);
  }

  /**
   * Finalização de compra
   */
  finishBuy() {
    this.settings.cartItems.clear();
    this.settings.finished = true;
  }

  /**
   * Deixa as colunas do grid responsivos
   */
  onResize() {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 500) {
      this.settings.gridCols = 1;
    } else if (windowWidth > 500 && windowWidth <= 680) {
      this.settings.gridCols = 2;
    } else if (windowWidth > 680 && windowWidth <= 1024) {
      this.settings.gridCols = 3;
    } else if (windowWidth > 1024 && windowWidth <= 1400) {
      this.settings.gridCols = 5;
    } else {
      this.settings.gridCols = 6;
    }
  }

}
