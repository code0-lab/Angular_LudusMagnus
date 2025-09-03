import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { IToken } from '../models/IToken';

@Injectable({
  providedIn: 'root' // Singleton pattern ile sadece bir tane instance oluşturulur
})
export class TokenService {
  private apiUrl = 'http://localhost:3000/tokens';

  constructor(private http: HttpClient) {}

  // Token oluştur
  generateToken(userId: number): Observable<IToken> {
    const token = this.createRandomToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 saat sonra
    const createdAt = new Date().toISOString();

    const newToken: Omit<IToken, 'id'> = {
      token,
      userId,
      expiresAt,
      createdAt
    };

    return this.http.post<IToken>(this.apiUrl, newToken);
  }

  // Token doğrula
  validateToken(token: string): Observable<IToken | null> {
    return this.http.get<IToken[]>(`${this.apiUrl}?token=${token}`).pipe(//pipe map operatörü bir sonraki operatöre veriyi aktarır subscribe kullansaydık map kullanamazdık
      map(tokens => {// map operatörü zincirleme işlemi yapar
        if (tokens.length === 0) return null;
        
        const foundToken = tokens[0];
        const now = new Date();
        const expiresAt = new Date(foundToken.expiresAt);
        
        // Token süresi dolmuş mu kontrol et
        if (now > expiresAt) {
          this.deleteToken(foundToken.id!).subscribe(); // Süresi dolmuş token'ı sil
          return null;
        }
        
        return foundToken;
      }),
      catchError(() => of(null))
    );
  }

  // Kullanıcının token'ını getir, ortak fonksiyonda kullanılabilirdi ancak daha esnek kod kullanımı için ayrı fonksiyonda oluşturulmuşturuldu.
  getUserToken(userId: number): Observable<IToken | null> {
    return this.http.get<IToken[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      map(tokens => {
        if (tokens.length === 0) return null;
        
        const userToken = tokens[0];
        const now = new Date();
        const expiresAt = new Date(userToken.expiresAt);
        
        // Token süresi dolmuş mu kontrol et
        if (now > expiresAt) {
          this.deleteToken(userToken.id!).subscribe(); // Süresi dolmuş token'ı sil
          return null;
        }
        
        return userToken;
      }),
      catchError(() => of(null))
    );
  }

  // Token sil
  deleteToken(tokenId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${tokenId}`);
  }

  // Kullanıcının tüm token'larını sil
  deleteUserTokens(userId: number): Observable<any> {
    return this.http.get<IToken[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      map(tokens => {
        tokens.forEach(token => {
          this.deleteToken(token.id!).subscribe();
        });
        return true;
      }),
      catchError(() => of(false))
    );
  }

  // Süresi dolmuş token'ları temizle
  cleanupExpiredTokens(): Observable<any> {
    return this.http.get<IToken[]>(this.apiUrl).pipe(
      map(tokens => {
        const now = new Date();
        tokens.forEach(token => {
          const expiresAt = new Date(token.expiresAt);
          if (now > expiresAt) {
            this.deleteToken(token.id!).subscribe();
          }
        });
        return true;
      }),
      catchError(() => of(false))
    );
  }

  // Rastgele token oluştur
  private createRandomToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; //karakter havuzu
    let result = '';  // Boş string ile başla, karakterleri buraya biriktir (let metodu hafızada yer açar)
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length)); //random kullanıp rastgele karakter seç ve ekle
    }
    return result; // 64 karakterlik token döndür
  }
}