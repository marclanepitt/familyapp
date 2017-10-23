import axios from "axios";
import Cookies from "js-cookie";
import { isEmpty } from 'lodash';


class Api {
  constructor() {
    this.uuid = Cookies.get("uuid") || "";
    this.user = {};
    this.userProfile = {};
    this.upid = Cookies.get("upid");
    this.apiVersion = "v1";
    this.url = "http://localhost:8000/api";
  }

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  generateUrl(url, version=null) {
    if(version == null) {
      return `${this.url}/${url}`;
    } else {
      return `${this.url}/${version}/${url}`;
    }
  }

  generateTokenHeader() {
    return {Authorization : `Token ${this.uuid}` };
  }

  registerUser(data, onSuccess, onError) {
    return axios
      .post(this.generateUrl("auth/registration/"), data)
      .then(response => {
        onSuccess(response);
      })
      .catch(err => {
        onError(err);
      });
  }


  loginUser(data, onSuccess, onError) {
    const config = {
      auth: data
    };
    return axios
      .post(this.generateUrl("auth/login/"), {}, config)
      .then(response => {
        this.user = response.data.user;
        this.uuid = response.data.token;
        return onSuccess(response);
      })
      .catch(err => {
        return onError(err);
      });
  }

  logoutUser(onSuccess, onError) {
    return axios
      .post(this.generateUrl("auth/logout/"), {}, {
        headers: this.generateTokenHeader()
      })
      .then(response => {
        this.user = {};
        this.uuid = "";
        this.upid = "";
        Cookies.remove('uuid');
        Cookies.remove('upid');
      })
      .catch(err => {
        console.error(err);
      });
  }

  loginUserProfile(data,onSuccess,onError,id) {
      return axios
      .post(this.generateUrl("users/login/"+id,"v1"), data, {
        headers: this.generateTokenHeader()
      })
      .then(response => {
        return onSuccess(response);
      })
      .catch(err => {
        return onError(err);
      });
  }

  store(name, data) {
    Cookies.set(name, data, { expires: 10 / 24 });
  }

  removeCookie(name) {
    Cookies.remove(name);
  }

  getCookie(name) {
    Cookies.get(name);
  }

  getUser() {
    if (isEmpty(this.user)) {
      return axios.get(this.generateUrl("users/me/","v1"), {
          headers: this.generateTokenHeader()
        })
        .then(response => {
          this.user = response.data;
          return this.user;
        });
    } else {
      return this.user;
    }
  }


  getUserProfile(upid) {
    return axios
      .get(this.generateUrl("users/list/"+upid,"v1"), {
        headers: this.generateTokenHeader()
      })
      .then(response => {
        this.userProfile = response.data[0];
        return response.data[0];
      })
      .catch(err => {
        return err;
      });
  }

  updateUserProfile(data, onSuccess,onError) {
    return axios
        .put(this.generateUrl("users/update/"+this.upid+"/", "v1"),data, {
          headers:this.generateTokenHeader(),
        })
        .then(response => {
          return onSuccess(response.data);
        })
        .catch(err=> {
          return onError(err);
        })
  }

  isAuthenticated() {
    return this.uuid !== "";
  }

  setUser(user) {
    this.user = user;
  }

  getCharges() {
    return axios
        .get(this.generateUrl("finances/charges/"+this.user.family.id,"v1"), {
          headers: this.generateTokenHeader()
        })
        .then(response => {
          return response.data
        })
        .catch(err => {
          return err;
        })
  }

  createCharge(data, onSuccess, onError) {
    return axios
        .post(this.generateUrl("finances/charges/create/"+this.user.family.id,"v1"),data, {
          headers: this.generateTokenHeader()
        })
        .then(response => {
          return onSuccess(response);
        })
        .catch(err => {
          return onError(err);
        })
  }

  getPosts() {
    return axios
        .get(this.generateUrl("posts/"+this.user.family.id,"v1"), {
          headers: this.generateTokenHeader()
      })
        .then(response=> {
          return response.data;
        })
        .catch(err => {
          return err;
        })
  }

  getChores() {
    return axios
        .get(this.generateUrl("chores/" + this.user.family.id, "v1"), {
          headers:this.generateTokenHeader()
        })
        .then(response=> {
          return response.data;
        })
        .catch(err=> {
          return err;
        })
  }

  getUsersChores() {
        return axios
        .get(this.generateUrl("chores/user/" + this.userProfile.id, "v1"), {
          headers:this.generateTokenHeader()
        })
        .then(response=> {
          return response.data;
        })
        .catch(err=> {
          return err;
        })
  }

  getAvailableChores() {
    return axios
        .get(this.generateUrl("chores/available/" + this.user.family.id ,"v1"), {
          headers:this.generateTokenHeader()
        })
        .then(response => {
          return response.data;
        })
        .catch(err=> {
          return err;
        })
  }

  updateChore(chore_pk,data) {
    return axios
        .put(this.generateUrl("chores/update/" + chore_pk + "/", "v1"),data, {
          headers:this.generateTokenHeader(),
        })
        .then(response => {
          return response.data;
        })
        .catch(err=> {
          return err;
        })
  }

  completeChore(chore_pk) {
      return axios.get(this.generateUrl("chores/complete/" + chore_pk +"/" + this.upid +"/","v1"), {
          headers: this.generateTokenHeader(),
      })
      .then(response => {
          return response.data;
      })
      .catch(err => {
          return err;
      })
  }

  getChoreLeaderBoard() {
      return axios.get(this.generateUrl("chores/leaderboard/" + this.user.family.id +"/","v1"), {
          headers: this.generateTokenHeader(),
      })
      .then(response => {
          return response.data;
      })
      .catch(err => {
          return err;
      })
  }

  getLeaderBoardPaginate(url) {
      return axios.get(url, {
          headers: this.generateTokenHeader(),
      })
      .then(response => {
          return response.data;
      })
      .catch(err => {
          return err;
      })
  }

  getChoreRewards() {
    return axios.get(this.generateUrl("chores/rewards/" + this.userProfile.id + "/", "v1"), {
      headers: this.generateTokenHeader(),
    })
    .then(response => {
      return response.data;
    })
    .catch(err=> {
      return err;
    })
  }

  updateChoreReward(reward_pk,data) {
    return axios
        .put(this.generateUrl("chores/rewards/update/" + reward_pk + "/", "v1"),data, {
          headers:this.generateTokenHeader(),
        })
        .then(response => {
          return response.data;
        })
        .catch(err=> {
          return err;
        })
  }

    redeemChoreReward(reward_pk,data) {
    return axios
        .put(this.generateUrl("chores/rewards/redeem/" + reward_pk + "/", "v1"),data, {
          headers:this.generateTokenHeader(),
        })
        .then(response => {
          return response.data;
        })
        .catch(err=> {
          return err;
        })
  }

  createPet(data, onSuccess, onError) {
    return axios
        .post(this.generateUrl("pets/create/"+this.user.family.id,"v1"),data, {
          headers: this.generateTokenHeader()
        })
        .then(response => {
          return onSuccess(response);
        })
        .catch(err => {
          return onError(err);
        })
  }

}
export default class ApiInstance {
  static get instance() {
    if (!this[Api]) {
      this[Api] = new Api();
    }
    return this[Api];
  }
}
