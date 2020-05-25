import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SmartAuthPageComponent} from './smart-auth-page.component';
import {Store} from '@ngrx/store';
import {TestStore} from '../../../../store/test/test.store';
import {LoginUser} from '../../../../store/actions/auth.actions';
import {UserCredentialsModel} from '../../../../core/models/users/user-credentials.model';

describe('SmartAuthPageComponent', () => {
  let component: SmartAuthPageComponent;
  let fixture: ComponentFixture<SmartAuthPageComponent>;
  const mockStore = new TestStore();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmartAuthPageComponent],
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
    fixture = TestBed.createComponent(SmartAuthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a new login action', () => {
    component.form.patchValue({email: 'test@email.com', password: 'test'});
    spyOn(mockStore, 'dispatch');

    component.onLogin();

    const payload: UserCredentialsModel = {
      email: 'test@email.com',
      password: 'test'
    };
    expect(mockStore.dispatch).toHaveBeenCalledWith(new LoginUser(payload));
  });

});
