import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Profile } from '../models/profile';
import { ProfileService } from '../services/profile.service';
import { PaginatedList } from '../models/paginated-list';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileDisplayComponent } from '../profile-display/profile-display.component';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.sass']
})
export class SearchUsersComponent implements OnInit {
  loggedInProfile: Profile;
  profileList: PaginatedList<Profile>;
  formGroup = new FormGroup({
    userInput: new FormControl(''),
  });
  selectedProfile: Profile;
  selectedIsFollowed: boolean = false;
  @ViewChild(ProfileDisplayComponent) profileDisplay: ProfileDisplayComponent;

  constructor(
    private profileService: ProfileService,
    public modalService: NgbModal) {
    this.profileList = new PaginatedList<Profile>();
    this.profileService.getProfile().subscribe((data: Profile) => {
      this.loggedInProfile = data;
    });
    this.profileService.getAll().subscribe((data: PaginatedList<Profile>) => {
      this.profileList = data;
    });
   }

  ngOnInit(): void {
  }

  searchForUser() {
    alert (this.formGroup.controls.userInput.value);
    this.profileService.search(this.formGroup.controls.userInput.value).subscribe((data: PaginatedList<Profile>) => {
      this.profileList = data;
    })
  }

  keydown(event): void {
    if (event.key === 'Enter') {
      this.searchForUser();
    }
  }

  openModal(profile: Profile) {
    this.selectedIsFollowed = false;
    this.selectedProfile = profile;
    this.loggedInProfile.followingList.forEach(element => {
      if (element.uid === profile.uid)
        this.selectedIsFollowed = true;      
    });
    this.profileDisplay.setProfile(profile, false);
    document.getElementById('profileHeader').innerHTML = `User profile: ${profile.uid}`;
    document.getElementById('profileModal').style.display = 'block';
  }

  closeModal() {
    document.getElementById('profileModal').style.display = 'none';
  }

  follow(profile: Profile): void {
    this.loggedInProfile.followingList.push(this.selectedProfile);
    this.profileService.sendProfile(this.loggedInProfile);
    this.modalService.dismissAll();
  }

  unfollow(profile: Profile): void {
    this.loggedInProfile.followingList = this.loggedInProfile.followingList.filter(e => e.uid != profile.uid);
    this.profileService.sendProfile(this.loggedInProfile);
    this.modalService.dismissAll();
  }
}