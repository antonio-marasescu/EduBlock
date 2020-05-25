import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {TestStore} from '../../../../store/test/test.store';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {selectFiles, selectFilesStateIsLoading} from '../../../../store/reducers/files.reducer';
import {of} from 'rxjs';
import {SmartRecordDetailsComponent} from './smart-record-details.component';
import {selectCurrentRecord, selectRecordsStateIsLoading} from '../../../../store/reducers/records.reducer';
import {GetFilesOfTransactionByHash} from '../../../../store/actions/files.actions';
import {GetRecordTransactionByHash} from '../../../../store/actions/records.actions';

describe('SmartRecordDetailsComponent', () => {
  let component: SmartRecordDetailsComponent;
  let fixture: ComponentFixture<SmartRecordDetailsComponent>;
  const recordHash = 'some-hash';
  let mockStore;
  let router: Router;

  beforeEach(async(() => {
    mockStore = new TestStore();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: 'records/' + recordHash, component: SmartRecordDetailsComponent},
      ])],
      declarations: [SmartRecordDetailsComponent],
      providers: [
        {
          provide: Store,
          useValue: mockStore
        },
        {
          provide: ActivatedRoute, useValue: {
            params: of({id: recordHash})
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(SmartRecordDetailsComponent);
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
    expect(mockStore.select).toHaveBeenCalledWith(selectCurrentRecord);
    expect(mockStore.select).toHaveBeenCalledWith(selectRecordsStateIsLoading);
    expect(mockStore.select).toHaveBeenCalledWith(selectFilesStateIsLoading);
    expect(mockStore.select).toHaveBeenCalledWith(selectFiles);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new GetRecordTransactionByHash(recordHash));
    expect(mockStore.dispatch).toHaveBeenCalledWith(new GetFilesOfTransactionByHash(recordHash));
  });
});
