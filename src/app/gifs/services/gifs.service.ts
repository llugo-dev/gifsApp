import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';


@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'iZS6L7FhOzInDYydPG2BUTH3V6NgVAEw';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs'
  private _historial: string[] = [];

  // TODO: Cambiar any por su tipo correspondiente
  public resultados: Gif[] = [];

  constructor(
    private http: HttpClient
  ) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }


  get historial(): string[] {
    return [...this._historial];
  }

  buscarGifs(query: string): void {

    if (query.trim().length === 0) {
      return;
    }

    query = query.toLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);  
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query)

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
      .subscribe((response) => {
        console.log(response.data);
        this.resultados = response.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });

  }
}
