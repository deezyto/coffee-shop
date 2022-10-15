import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from 'yup';
import ProfileOptionPage from '../ProfileOptionPage/ProfileOptionPage';
import * as actions from '../../../redux/actions';
import './setting.scss';

const CreateField = ({currentUserProfileForm, setTypeUserForm, formName, fieldName, fieldData, validationSchema}) => {
  const currentForm = `FORM ${formName.toUpperCase()}`;
  return (
      <>
      <Formik
          initialValues = {{
            [formName]: ''
          }}

          validationSchema={validationSchema}
          
          onSubmit={values => {
            console.log('submit ' + formName);
            setTypeUserForm('FORM CANCEL')
          }}
          >
          
        <div className="field">
          {fieldName}: <span onClick={() => setTypeUserForm(currentForm)}>{fieldData}</span>
          {currentUserProfileForm === formName ?

          <Form>
            <div className="current-form">
            <Field
              id={formName}
              name={formName}
              type="text"
              placeholder={'Enter ' + formName}
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
            
            <FormikErrorMessage name={formName} style={{padding: 5, display: 'block'}} component="p" />
          </Form>
          : null
          }
          
        </div>
        </Formik>
      </>
  )
}
class UserSetting extends Component {
  render() {
    const {currentUserProfileForm, setTypeUserForm} = this.props;
    return (
      <ProfileOptionPage>
        <h3>Setting</h3>
          <div className="user-settings">
              <div className="fields">
                <div className="field">
                  Login: login
                </div>
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setTypeUserForm={setTypeUserForm}
                  formName={'name'}
                  fieldName={'Name'}
                  fieldData={'Mike'}
                  validationSchema={
                    Yup.object({
                      name: Yup.string()
                              .min(2, 'Min characters for name must be 2')
                              .required('Its field is required'),
                    })
                  }
                />
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setTypeUserForm={setTypeUserForm}
                  formName={'surname'}
                  fieldName={'Surname'}
                  fieldData={'Smith'}
                  validationSchema={
                    Yup.object({
                      surname: Yup.string()
                              .min(2, 'Min characters for surname must be 2')
                              .required('Its field is required'),
                    })
                  }
                />
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setTypeUserForm={setTypeUserForm}
                  formName={'password'}
                  fieldName={'Password'}
                  fieldData={'change'}
                  validationSchema={
                    Yup.object({
                      password: Yup.string()
                              .min(8, 'Min characters for passwotd must be 8')
                              .required('Its field is required'),
                    })
                  }
                />
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setTypeUserForm={setTypeUserForm}
                  formName={'email'}
                  fieldName={'Email'}
                  fieldData={'mike@example.com'}
                  validationSchema={
                    Yup.object({
                      email: Yup.string().email()
                              .required('Its field is required'),
                    })
                  }
                />
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setTypeUserForm={setTypeUserForm}
                  formName={'address'}
                  fieldName={'Address'}
                  fieldData={'current'}
                />
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setTypeUserForm={setTypeUserForm}
                  formName={'phone'}
                  fieldName={'Phone'}
                  fieldData={'+382020430203'}
                  validationSchema={
                    Yup.object({
                      phone: Yup.number().positive()
                              .required('Its field is required'),
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
    currentUserProfileForm: state.currentUserProfileForm
  }
}

export default connect(mapStateToProps, actions)(UserSetting);