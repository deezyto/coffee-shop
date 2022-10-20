import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from 'yup';
import ProfileOptionPage from '../ProfileOptionPage/ProfileOptionPage';
import * as actions from '../../../redux/actions';
import Service from '../../../service/service';
import { getItem, setItem } from '../../../store/localStorage';
import './setting.scss';

const CreateField = ({currentUserProfileForm, 
                      setCurrentUserProfileForm, 
                      fieldName, 
                      fieldText,
                      fieldData,
                      validationSchema, 
                      onHandleSubmit,
                      fieldType}) => {
  //const data = localStorage.getItem('userData') !== 'undefined' ? JSON.parse(localStorage.getItem('userData'))?.[fieldName] : null;
  //const data = getItem('userData', fieldName) ? getItem('userData', fieldName) : null;
  const data = fieldData[fieldName] ? fieldData[fieldName] : null;
  const fieldDataLocalStorage = data && fieldName !== 'password' ? data : 'change';
  return (
      <>
      <Formik
          initialValues = {{
            [fieldName]: ''
          }}

          validationSchema={validationSchema}
          
          onSubmit={values => {
            console.log('submit ' + fieldName);
            setCurrentUserProfileForm('FORM CANCEL');
            onHandleSubmit(values)
          }}
          >
          
        <div className="field">
          {fieldText}: <span onClick={() => setCurrentUserProfileForm(undefined, fieldName)}>{fieldDataLocalStorage}</span>
          {currentUserProfileForm === fieldName ?

          <Form>
            <div className="current-form">
            <Field
              id={fieldName}
              name={fieldName}
              type={fieldType}
              placeholder={'Enter ' + fieldName}
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
                  setCurrentUserProfileForm('FORM CANCEL')
                  e.currentTarget.form.reset()
                }}
                >
                cancel
              </button>
            </div>
            </div>
            
            <FormikErrorMessage name={fieldName} style={{padding: 5, display: 'block'}} component="p" />
          </Form>
          : null
          }
          
        </div>
        </Formik>
      </>
  )
}
class UserSetting extends Component {
  
  onChangeField = (obj) => {
    new Service().userChangeFieldProfile(obj, {"Authorization": `Bearer ${this.props.authToken}`})
      .then(res => {
        localStorage.setItem('userProfileFields', JSON.stringify(res));
        this.props.setUserProfileFields(res);
      })
      .catch(e => console.log(e));
  }
  render() {
    const {currentUserProfileForm, setCurrentUserProfileForm, userProfileFields} = this.props;
    return (
      <ProfileOptionPage>
        <h3>Setting</h3>
          <div className="user-settings">
              <div className="fields">
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setCurrentUserProfileForm={setCurrentUserProfileForm}
                  fieldName={'name'}
                  fieldText={'Name'}
                  fieldType={'text'}
                  fieldData={userProfileFields}
                  onHandleSubmit={this.onChangeField}
                  validationSchema={
                    Yup.object({
                      name: Yup.string()
                              .min(2, 'Min characters for name must be 2')
                              .required('Its field is required')
                    })
                  }
                />
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setCurrentUserProfileForm={setCurrentUserProfileForm}
                  fieldName={'surname'}
                  fieldText={'Surname'}
                  fieldType={'name'}
                  fieldData={userProfileFields}
                  onHandleSubmit={this.onChangeField}
                  validationSchema={
                    Yup.object({
                      surname: Yup.string()
                              .min(2, 'Min characters for surname must be 2')
                              .required('Its field is required')
                    })
                  }
                />
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setCurrentUserProfileForm={setCurrentUserProfileForm}
                  fieldName={'password'}
                  fieldText={'Password'}
                  fieldType={'password'}
                  fieldData={userProfileFields}
                  onHandleSubmit={this.onChangeField}
                  validationSchema={
                    Yup.object({
                      password: Yup.string()
                              .min(8, 'Min characters for passwotd must be 8')
                              .required('Its field is required')
                    })
                  }
                />
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setCurrentUserProfileForm={setCurrentUserProfileForm}
                  fieldName={'email'}
                  fieldText={'Email'}
                  fieldType={'text'}
                  fieldData={userProfileFields}
                  onHandleSubmit={this.onChangeField}
                  validationSchema={
                    Yup.object({
                      email: Yup.string().email()
                              .required('Its field is required')
                    })
                  }
                />
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setCurrentUserProfileForm={setCurrentUserProfileForm}
                  fieldName={'address'}
                  fieldText={'Address'}
                  fieldType={'text'}
                  fieldData={userProfileFields}
                  onHandleSubmit={this.onChangeField}
                  validationSchema={
                    Yup.object({
                      address: Yup.string()
                              .max(100, 'Max characters for Your address must be a 100')
                    })
                  }
                />
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setCurrentUserProfileForm={setCurrentUserProfileForm}
                  fieldName={'phone'}
                  fieldText={'Phone'}
                  fieldType={'number'}
                  fieldData={userProfileFields}
                  onHandleSubmit={this.onChangeField}
                  validationSchema={
                    Yup.object({
                      phone: Yup.number().positive()
                              .required('Its field is required')
                    })
                  }
                />
              </div>
          </div>
      </ProfileOptionPage>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUserProfileForm: state.currentUserProfileForm,
    authToken: state.authToken,
    userProfileFields: state.userProfileFields
  }
}

export default connect(mapStateToProps, actions)(UserSetting);