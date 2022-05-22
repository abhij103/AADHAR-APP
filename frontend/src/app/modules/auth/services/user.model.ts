export class User {
    constructor(
      private _userId:string,
      private _token: string,
      private _tokenExpirationDate: Date
    ) {}
  
    get token() {
      if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
        return null;
      }
      return this._token;
    }
    
    public get userId() : string {
      return this._userId;
    }
    
    set tokenExpirationDate(newDate:Date){
       this._tokenExpirationDate = newDate
    }
  }
  