import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from 'yup';
import ProfileOptionPage from '../ProfileOptionPage/ProfileOptionPage';
import * as actions from '../../../redux/actions';
import './setting.scss';

const CreateField = ({currentUserProfileForm, 
                      setTypeUserForm, 
                      fieldName, 
                      fieldText, 
                      fieldData, 
                      validationSchema, 
                      fieldType}) => {
  const currentForm = `FORM ${fieldName.toUpperCase()}`;
  return (
      <>
      <Formik
          initialValues = {{
            [fieldName]: ''
          }}

          validationSchema={validationSchema}
          
          onSubmit={values => {
            console.log('submit ' + fieldName);
            setTypeUserForm('FORM CANCEL')
          }}
          >
          
        <div className="field">
          {fieldText}: <span onClick={() => setTypeUserForm(currentForm)}>{fieldData}</span>
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
                  setTypeUserForm('FORM CANCEL')
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
                  fieldName={'name'}
                  fieldText={'Name'}
                  fieldData={'Mike'}
                  fieldType={'text'}
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
                  fieldName={'surname'}
                  fieldText={'Surname'}
                  fieldData={'Smith'}
                  fieldType={'name'}
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
                  fieldName={'password'}
                  fieldText={'Password'}
                  fieldData={'change'}
                  fieldType={'password'}
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
                  fieldName={'email'}
                  fieldText={'Email'}
                  fieldData={'mike@example.com'}
                  fieldType={'text'}
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
                  fieldName={'address'}
                  fieldText={'Address'}
                  fieldData={'current'}
                  fieldType={'text'}
                />
                <CreateField 
                  currentUserProfileForm={currentUserProfileForm} 
                  setTypeUserForm={setTypeUserForm}
                  fieldName={'phone'}
                  fieldText={'Phone'}
                  fieldType={'number'}
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