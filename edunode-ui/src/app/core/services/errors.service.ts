import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {
  constructor(private snackBar: MatSnackBar) {
  }

  setError(httpErrorObject: any) {
    const message = this.parseErrorMessage(httpErrorObject);
    this.snackBar.open(message, 'ok', {});
  }

  unsetError() {
    this.snackBar.dismiss();
  }

  parseErrorMessage(httpErrorObject: any) {
    if (httpErrorObject.error && Array.isArray(httpErrorObject.error)) {
      const errorMessage = httpErrorObject.error[0];
      const keys = Object.keys(errorMessage.constraints);
      return errorMessage.constraints[keys[0]];
    } else {
      return httpErrorObject.message;
    }
  }
}
