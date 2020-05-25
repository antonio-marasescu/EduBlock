import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {TestStore} from '../../../../store/test/test.store';
import {RegisterUser} from '../../../../store/actions/auth.actions';
import {UserCredentialsModel} from '../../../../core/models/users/user-credentials.model';
import {SmartRegisterPageComponent} from './smart-register-page.component';

describe('SmartRegisterPageComponent', () => {
  let component: SmartRegisterPageComponent;
  let fixture: ComponentFixture<SmartRegisterPageComponent>;
  const mockStore = new TestStore();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmartRegisterPageComponent],
      providers: [
        {
          provide: Store,
          useValue: mockStore
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartRegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a new login action', () => {
    component.form.patchValue({email: 'test@email.com', password: 'test'});
    spyOn(mockStore, 'dispatch');

    component.onRegister();

    const payload: UserCredentialsModel = {
      email: 'test@email.com',
      password: 'test'
    };
    expect(mockStore.dispatch).toHaveBeenCalledWith(new RegisterUser(payload));
  });

});
