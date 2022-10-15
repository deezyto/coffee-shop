import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from 'yup';
import ProfileOptionPage from '../ProfileOptionPage/ProfileOptionPage';
import * as actions from '../../../redux/actions';
import './setting.scss';
class UserSetting extends Component {
  render() {
    const {currentUserProfileForm, setTypeUserForm} = this.props;
    console.log(this.props)
    return (
      <ProfileOptionPage onProfile={this.props.onProfile}>
        <h3>Setting</h3>
        <Formik
          initialValues = {{
            name: '',
            surname: '',
            email: '',
            login: '',
            password: '',
            address: ''
          }}

          validationSchema = {Yup.object({
            name: Yup.string()
                    .min(2, 'Min characters for name must be 2')
                    .required('Its field is required'),
          })}

          onSubmit = {values => {
            //onSetQuery(values.search);
            console.log('submit')
            setTypeUserForm('FORM CANCEL')
          }}
          >
          
          <div className="user-settings">
              <div className="fields">
                <div className="field">
                  Login: login
                </div>
                <div className="field">
                  Name: <span onClick={() => setTypeUserForm('FORM NAME')}>user</span>
                  {currentUserProfileForm === 'name' ?

                  <Form>
                    <div className="current-form">
                    <Field
                      id="name"
                      name="name" 
                      type="text"
                      placeholder="Enter name"
                      >
                    </Field>
                    <div className="form-buttons">
                      <button type="submit" 
                        className="button"
                        
                        >
                        change
                      </button>
                      <button
                        type="reset"
                        className="button cancel"
                        onClick={(e) => {
                          setTypeUserForm('FORM CANCEL')
                          e.currentTarget.form.reset()
                        }}
                        >
                        cancel
                      </button>
                    </div>
                    </div>
                    
                    <FormikErrorMessage name="name" style={{padding: 5, display: 'block'}} component="p" />
                  </Form>
                  : null
                  }
                  
                </div>
                <div className="field">
                  Surname: <span>surname</span>
                </div>
                <div className="field">
                  Password: <span>change</span>
                </div>
                <div className="field">
                  Email: <span>email</span>
                </div>
                <div className="field">
                  Address: <span>change</span>
                </div>
                <div className="field">
                  Tel: <span>tel</span>
                </div>
              </div>
          </div>
        </Formik>
      </ProfileOptionPage>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUserProfileForm: state.currentUserProfileForm
  }
}

export default connect(mapStateToProps, actions)(UserSetting);