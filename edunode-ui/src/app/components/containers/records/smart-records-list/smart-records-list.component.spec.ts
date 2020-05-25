import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {TestStore} from '../../../../store/test/test.store';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {RecordsListActionTypes, SmartRecordsListComponent} from './smart-records-list.component';
import {selectRecords, selectRecordsStateIsLoading} from '../../../../store/reducers/records.reducer';
import {CreateBlock, GetRecordsTransaction} from '../../../../store/actions/records.actions';

describe('SmartRecordsListComponent', () => {
  let component: SmartRecordsListComponent;
  let fixture: ComponentFixture<SmartRecordsListComponent>;
  let mockStore;
  let router: Router;

  beforeEach(async(() => {
    mockStore = new TestStore();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: 'records/create', component: SmartRecordsListComponent}
      ])],
      declarations: [SmartRecordsListComponent],
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
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(SmartRecordsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit()', () => {
    spyOn(mockStore, 'select').and.returnValue(of([]));
    spyOn(mockStore, 'dispatch');
    component.ngOnInit();
    expect(mockStore.select).toHaveBeenCalledWith(selectRecords);
    expect(mockStore.select).toHaveBeenCalledWith(selectRecordsStateIsLoading);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new GetRecordsTransaction());
  });

  it('should navigate to records creation on Create Transaction Event', () => {
    spyOn(router, 'navigateByUrl');
    component.onAction(RecordsListActionTypes.CREATE_TRANSACTION);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/records/create');
  });

  it('should dispatch CreateBlock action on Create Block Event', () => {
    spyOn(mockStore, 'dispatch');
    component.onAction(RecordsListActionTypes.CREATE_BLOCK);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new CreateBlock());
  });

  it('should dispatch GetRecordsTransaction action on Refresh Transactions Event', () => {
    spyOn(mockStore, 'dispatch');
    component.onAction(RecordsListActionTypes.REFRESH_TRANSACTIONS);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new GetRecordsTransaction());
  });
});
