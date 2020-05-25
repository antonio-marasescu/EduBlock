import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {
  RecordFilterOptions,
  SmartRecordsListFilterOptionsComponent
} from './smart-records-list-filter-options.component';
import {EduRecordModel} from '../../../../core/models/records/edu-record.model';
import {debounceTime, tap} from 'rxjs/operators';

describe('SmartRecordsListFilterOptionsComponent', () => {
  let component: SmartRecordsListFilterOptionsComponent;
  let fixture: ComponentFixture<SmartRecordsListFilterOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [SmartRecordsListFilterOptionsComponent],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartRecordsListFilterOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call filter data on form value change', (done) => {
    component.ngOnInit();
    const spy = spyOn(component, 'filterData');
    component.filterForm.valueChanges.pipe(debounceTime(170), tap(() => {
      expect(spy).toHaveBeenCalledWith({filterValue: 'any', filterType: RecordFilterOptions.ByTitle});
      done();
    })).subscribe();
    component.filterForm.patchValue({filterValue: 'any', filterType: RecordFilterOptions.ByTitle});
  });

  it('should filter data on form value change', (done) => {
    component.ngOnInit();
    component.data = [{title: 'not-filtered-any'} as EduRecordModel, {title: 'filtered'} as EduRecordModel];
    component.filter.subscribe(value => {
      expect(value).toEqual([{title: 'not-filtered-any'} as EduRecordModel]);
      done();
    });
    component.filterForm.patchValue({filterValue: 'any', filterType: RecordFilterOptions.ByTitle});
  });
});
