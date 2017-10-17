import React, { Component } from "react";
import ApiInstance from "../../js/utils/Api";
import "./css/main.css";
import {
  Button,
  Col,
  Navbar,
  Nav,
  NavItem,
  Image,
} from "react-bootstrap";
import {GridLoader} from 'react-spinners';

const Api = ApiInstance.instance;

export default class Family extends Component {
    constructor(props) {
    super(props);
    this.state = {
      loading:true,
      userProfile: {},
      family:{},
    };
  }

  componentDidMount() {
        this.setState({
            userProfile:Api.userProfile,
            family:Api.user.family,
            loading:false,
        });
  }


  render() {
      const {loading,family} = this.state;
    return (
      <div>
          {loading ?
              <div className="col-sm-2 col-sm-offset-5 loader"
              >
                <GridLoader
                    color={'#102C58'}
                    loading={loading}
                />
              </div>
              :
              <div>
                  {family.users.map((member) =>
                      <div style={{width:100}}>
                          <Image src={member.pro_pic} circle responsive/>
                      </div>
                  )}
              </div>
          }
      </div>
    );
  }
}
