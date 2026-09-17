import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, CheckCircle2, User } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import styles from "../../style/UserLogin_modules/signup.module.css"
import { useFormik } from "formik"
import { signupValidationSchema } from "../../schemas/signupValidation"
import axios from "axios"
import { FaChevronDown } from "react-icons/fa"
import countries from "../../utils/countries"
import { toast } from "react-toastify"
import { deleteUser, sendOtp, verifyOtp } from "../../services/user.service"
import { useSignupStore } from "../../store/signupStore"
import { useErrorStore } from "../../store/errorStore"

export default function Signup() {
  const navigate = useNavigate()

  // Disable btns state
  const [loading, setLoading] = useState(false)
  // Animation state
  const [loadState, setLoadState] = useState(false)
  // Operation success state
  const [success, setSuccess] = useState("")
  // Open or close countries dropdown
  const [showDropdown, setShowDropdown] = useState(false)
  // Selected country from the dropdown
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  // Searched country
  const [searchTerm, setSearchTerm] = useState("")
  // is user fill the signup form
  const [isUserDetailsSubmitted, setIsUserDetailsSubmitted] = useState(false)
  // sms otp
  const [smsOtp, setSmsOtp] = useState("")
  // email otp
  const [emailOtp, setEmailOtp] = useState("")
  // used in verifyOtpOfEmailAndSms function
  const [userDetails, setUserDetails] = useState(null)

  const setIsOtpVerified = useSignupStore((state) => state.setIsOtpVerified)
  const setError = useErrorStore((state) => state.setError)
  const error = useErrorStore((state) => state.error)

  const dropdownRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      setError("")
    }, 5000)
  }, [error])

  useEffect(() => {
    const timerId = setTimeout(() => setLoadState(true), 10)
    return () => {
      clearTimeout(timerId)
      setLoadState(false)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    return async () => {
      const { isOtpVerified } = useSignupStore.getState()
      userDetails &&
        !isOtpVerified &&
        (await deleteUser(userDetails._id, userDetails.password))
    }
  }, [userDetails])

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.dialCode.includes(searchTerm),
  )

  const initialValuesForSignup = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  }

  const formik = useFormik({
    initialValues: initialValuesForSignup,
    validationSchema: signupValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      try {
        setLoading(true)
        setIsOtpVerified(false)

        const body = {
          phoneNumber: values.phoneNumber,
          phoneSuffix: selectedCountry.dialCode,
          username: values.name,
          email: values.email,
          password: values.confirmPassword,
        }

        const url = `${import.meta.env.VITE_API_URL}/api/users/register`

        const response = await axios.post(url, body)
        setUserDetails(response.data.data)

        action.resetForm()

        if (values.email) {
          const response = await sendOtp(
            null,
            null,
            values.email,
            values.confirmPassword,
          )
          if (response.status === "success") {
            toast.success("OTP sent to email")
            setTimeout(() => {
              setIsUserDetailsSubmitted(true)
            }, 1500)
          }
        }
        // if (values.phoneNumber && selectedCountry.dialCode) {
        //   const response = await sendOtp(
        //     values.phoneNumber,
        //     selectedCountry.dialCode,
        //   )
        //   console.log("OTP send:", response)
        //   if (response.status === "success") {
        //     toast.info("OTP send to phone successfully")
        //   }
        // }
      } catch (error) {
        if (error.message === "User already exists.") {
          setError && setError("User already exists.")
          return
        }
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.error(error.response?.data?.message || error.message)
          console.dir(error)
        }
        setError(error.response?.data?.message || error.message)
      } finally {
        setLoading(false)
      }
    },
  })

  const verifyOtpOfEmailAndSms = async (e) => {
    e.preventDefault()
    try {
      let response
      let isBothOtpVerified = 0
      if (emailOtp) {
        response = await verifyOtp(null, null, emailOtp, userDetails.email)
        if (response.status === "success") {
          isBothOtpVerified += 1
        } else {
          isBothOtpVerified += 0
        }
      }
      // if (smsOtp) {
      //   response = await verifyOtp(
      //     values.phoneNumber,
      //     selectedCountry.dialCode,
      //     smsOtp,
      //   )
      //   if (response.status === "success") {
      //     isBothOtpVerified += 1
      //   } else {
      //     isBothOtpVerified += 0
      //   }
      // }
      if (isBothOtpVerified === 1) {
        setIsOtpVerified(true)
        setSuccess("Signup successful")
        setTimeout(() => {
          navigate("/user-login")
        }, 1500)
      }
    } catch (error) {
      if (error.message === "Invalid or expired OTP") {
        await deleteUser(userDetails._id, userDetails.password)
        setIsUserDetailsSubmitted(false)
      }
      if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
        console.error(error.response?.data?.message || error.message)
        console.dir(error)
      }
      setError(error.response?.data?.message || error.message)
    }
  }

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = formik

  return (
    <div className={styles.container}>
      {!isUserDetailsSubmitted ? (
        <div
          className={`${styles.heroSection} ${
            loadState ? styles.heroLoaded : styles.heroUnloaded
          }`}
        >
          {loading || isUserDetailsSubmitted ? (
            <button
              className={styles.backButton}
              disabled={loading}
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
              <ArrowLeft className={styles.backIcon} />
            </button>
          ) : (
            <Link to="/home" className={styles.backButton}>
              <ArrowLeft className={styles.backIcon} />
            </Link>
          )}

          <h1 className={styles.heading}>
            Create your account <br />
            <p className={styles.gradientText}>
              Start conversations with Socketly today.
            </p>
          </h1>

          <p className={styles.subheading}>
            Create an account to start conversations with Socketly.
          </p>
        </div>
      ) : (
        <div
          className={`${styles.heroSection} ${
            loadState ? styles.heroLoaded : styles.heroUnloaded
          }`}
        >
          <h1 className={styles.heading}>
            Verify OTP <br />
            <p className={styles.gradientText}>Enter the OTP send to email</p>
            <p
              className="fs-5"
              style={{ color: "#9B57FA" }}
            >{`${userDetails.email}`}</p>
          </h1>

          <p className={styles.subheading}>
            Create an account to start conversations with Socketly.
          </p>
        </div>
      )}

      <div
        className={`${styles.formWrapper} ${
          loadState ? styles.formLoaded : styles.formUnloaded
        }`}
      >
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Sign up</h2>

          {error && <div className={styles.errorAlertBanner}>{error}</div>}

          {success && (
            <div className={styles.successAlertBanner}>
              <CheckCircle2 className={styles.successIcon} size={16} />
              <span>{success}</span>
            </div>
          )}

          {!isUserDetailsSubmitted ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone Number</label>
                <div className={styles.relativeInputWrapper}>
                  <div className={styles.phoneInputGroup}>
                    <div className={styles.countryWrapper}>
                      <button
                        type="button"
                        className={`${styles.countryButton}`}
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        <span>
                          {selectedCountry.flag} {selectedCountry.dialCode}
                        </span>
                        <FaChevronDown style={{ marginLeft: "0.5rem" }} />
                      </button>
                      {showDropdown && (
                        <div
                          ref={dropdownRef}
                          className={`${styles.dropdownMenu}`}
                        >
                          <div className={`${styles.dropdownSearchSticky}`}>
                            <input
                              type="text"
                              placeholder="Search countries..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className={`${styles.dropdownSearchInput}`}
                            />
                          </div>
                          {filteredCountries.map((country) => (
                            <button
                              key={country.alpha2}
                              type="button"
                              className={`${styles.dropdownItem}`}
                              onClick={() => {
                                setSelectedCountry(country)
                                setShowDropdown(false)
                              }}
                            >
                              {country.flag} ({country.dialCode}){" "}
                              <span className="d-block">{country.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={(e) => {
                        setFieldValue("phoneNumber", e.target.value)
                      }}
                      onBlur={handleBlur}
                      className={`${styles.phoneNumberInput} ${errors.phoneNumber && touched.phoneNumber ? styles.inputError : ""}`}
                      placeholder="Phone Number"
                    />
                  </div>
                  {errors.phoneNumber && touched.phoneNumber ? (
                    <p className={styles.fieldError}>{errors.phoneNumber}</p>
                  ) : null}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIcon}>
                    <User className={styles.inputIconSvg} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={values.name || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${styles.inputWithIcon} ${errors.name && touched.name ? styles.inputError : ""}`}
                    placeholder="John Doe"
                    required
                  />
                </div>
                {errors.name && touched.name ? (
                  <p className={`text-danger my-0 ${styles.errorMessage}`}>
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    name="email"
                    value={values.email || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ""}`}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                {errors.email && touched.email ? (
                  <p className={`text-danger my-0 ${styles.errorMessage}`}>
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    name="password"
                    value={values.password || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errors.password && touched.password ? styles.inputError : ""}`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {errors.password && touched.password ? (
                  <p className={`text-danger my-0 ${styles.errorMessage}`}>
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errors.confirmPassword && touched.confirmPassword ? styles.inputError : ""}`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {errors.confirmPassword && touched.confirmPassword ? (
                  <p className={`text-danger my-0 ${styles.errorMessage}`}>
                    {errors.confirmPassword}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                Submit
              </button>

              <div className={styles.divider}>
                <div className={styles.dividerLine}>
                  <div className={styles.dividerBorder}></div>
                </div>
                <div className={styles.dividerTextWrapper}>
                  <span className={styles.dividerText}>Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  (window.location.href = import.meta.env.PROD
                    ? "/auth/google"
                    : "http://localhost:3000/auth/google")
                }
                className={styles.googleBtn}
              >
                <FcGoogle className={styles.googleIcon} />
                Continue with Google
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtpOfEmailAndSms}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Enter SMS OTP</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={smsOtp}
                    onChange={(e) => setSmsOtp(e.target.value)}
                    className={`${styles.input}`}
                    placeholder="••••••"
                  />
                </div>
              </div>
              <br />
              <div className={styles.inputGroup}>
                <label className={styles.label}>Enter Email OTP</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    className={`${styles.input}`}
                    placeholder="••••••"
                    required
                  />
                </div>
              </div>
              <br />
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!emailOtp}
              >
                Sign Up
              </button>
            </form>
          )}

          {!isUserDetailsSubmitted && (
            <p className={styles.switchAuthText}>
              Already have an account?
              <Link to="/user-login" className={styles.switchAuthLink}>
                Log In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
