import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { MapService } from 'src/app/shared/services/map.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ArticleDialogComponent } from '../article-dialog/article-dialog.component';

@Component({
  selector: 'app-edit-map',
  templateUrl: './edit-map.component.html',
  styleUrls: ['./edit-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditMapComponent implements OnInit {
  @ViewChild('image') image!: ElementRef;
  pins!: { x: string, y: string, country: string }[];
  newPins: { x: string, y: string, country: string }[] = [];
  pinsForDelete: { x: string, y: string, country: string }[] = [];
  pinAdded = false;
  id!: string;
  addMode = false;
  deleteMode = false;

  controls = {
    country: new FormControl('')
  }
  form: FormGroup = new FormGroup(this.controls);
  constructor(private mapService: MapService,
    public location: Location,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private userService: UserService) {
    if (!userService.isLoggedIn) {
      router.navigate(['./admin']);
    }
  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    this.mapService.getMap().subscribe(response => {
      this.id = response[0].id;
      this.pins = response[0].pins;
      this.cdr.markForCheck();
    });
  }

  onMapClick(e: MouseEvent) {
    if (this.addMode) {
      const positionX = (((e.offsetX - 5) * 100) / this.image.nativeElement.offsetWidth).toString() + "%";
      const positionY = (((e.offsetY - 5) * 100) / this.image.nativeElement.offsetHeight).toString() + "%";
      this.pins.push({ x: positionX, y: positionY, country: '' });
      this.newPins.push({ x: positionX, y: positionY, country: '' });
      this.pinAdded = true;
      this.cdr.markForCheck();
    }
  }

  checkNewPin(x: string, y: string) {
    return (this.newPins.find(p => p.x === x && p.y === y) && this.addMode) || (this.pinsForDelete.find(p => p.x === x && p.y === y) && this.deleteMode);
  }

  deleteLast() {
    const lastPinIndexInNew = this.newPins.indexOf(this.newPins[this.newPins.length - 1]);
    this.newPins.splice(lastPinIndexInNew, 1);
    const lastPinIndex = this.pins.indexOf(this.pins[this.pins.length - 1]);
    this.pins.splice(lastPinIndex, 1);
  }

  cancel() {
    this.controls.country.patchValue(null);
    if (this.addMode) {
      this.newPins.forEach(pin => {
        const index = this.pins.indexOf(pin);
        this.pins.splice(index, 1);
      });
    }
    this.pinAdded = false;
    this.newPins = [];
    this.pinsForDelete = [];
    this.addMode = false;
    this.deleteMode = false;
  }

  markPin(pin: { x: string, y: string, country: string }) {
    if (this.deleteMode) {
      this.pinsForDelete.push(pin);
    }
  }

  setMap() {
    const dialogRef = this.dialog.open(ArticleDialogComponent);

    if (this.addMode && this.newPins[0]) {
      this.pins.map(pin => {
        if (pin.x == this.newPins[0].x && pin.y == this.newPins[0].y) {
          pin.country = this.controls.country.value || '';
        }
      })
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.login({ pin: result.pin }).subscribe(response => {
          if (response) {
            if (this.deleteMode) {
              this.pinsForDelete.forEach(pin => {
                const index = this.pins.indexOf(pin);
                this.pins.splice(index, 1);
              });
            }

            this.mapService.updateMap(this.id, this.pins).pipe(catchError(error => {
              this.toastr.error('Pri modifikovaní mapy nastala chyba', 'Refreshni stránku a skús ešte raz.', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000
              });
              return throwError(error);
            })).subscribe(() => {
              this.toastr.success('Mapa úspešne modifikovaná', '', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000
              });
              this.getItems();
              this.addMode = false;
              this.deleteMode = false;
              this.pinAdded = false;
              this.controls.country.patchValue(null);
              this.newPins = [];
              this.pinsForDelete = [];
            })
          }
        })
      }
    })

}

}

