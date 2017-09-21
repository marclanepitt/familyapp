import axios from "axios";
import Cookies from "js-cookie";
import { isEmpty } from 'lodash';


class Api {
  constructor() {
    this.uuid = Cookies.get("uuid") || "";
    this.user = {};
    this.family = {};
    this.fuuid = Cookies.get("fuuid") || "";
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
        this.store("fuuid",response.data.family.id);
      })
      .catch(err => {
        onError(err);
      });
  }

  getFamilyID() {
    return Cookies.get("fuuid") || "";
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
        this.store("fuuid", response.data.user.family.id);
        return onSuccess(response);
      })
      .catch(err => {
          console.log(err);
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
        Cookies.remove('uuid');
      })
      .catch(err => {
        console.error(err);
      });
  }

  store(name, data) {
    Cookies.set(name, data, { expires: 10 / 24 });
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

  getFamily() {
    if (isEmpty(this.family)) {
        return axios.get(this.generateUrl("family/" + this.getFamilyID() +"/", "v1"), {
            headers: this.generateTokenHeader()
        }).then(response => {
            this.family = response.data;
            return this.family;
        });
    } else {
        return this.family;
    }
  }

  isAuthenticated() {
    return this.uuid !== "";
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
