import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  userSearch: string = '';
  // result$: any | null;

  adviceUrl = `https://api.adviceslip.com/advice/search/${this.userSearch}`;

  getAdvice(): Observable<any> {
    return this.http.get<any>(this.adviceUrl)
  }

  showAdvice(): void {
    this.getAdvice().subscribe(data => {
      const randomIndex = Math.floor(Math.random() * data.slips.length);
      console.log(data.slips);
      console.log(this.userSearch)
      return data.slips
    });
  }
}
