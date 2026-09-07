import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, CheckCircle2, CheckCircle2Icon, User } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import styles from "../../style/UserLogin_modules/signup.module.css"
import { useFormik } from "formik"
import { loginValidationSchema } from "../../schemas/loginValidation"
import { signupValidationSchema } from "../../schemas/signupValidation"
import axios from "axios"

export default function Signup({ type }) {
  const isLogin = type === "login" ? true : false
  const navigate = useNavigate()

  // Disable btns state
  const [loading, setLoading] = useState(false)
  // Animation state
  const [loadState, setLoadState] = useState(false)
  // Error State
  const [error, setIsError] = useState("")
  // Operation success state
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const timerId = setTimeout(() => setLoadState(true), 10)
    return () => {
      clearTimeout(timerId)
      setLoadState(false)
    }
  }, [type])

  const initialValuesForLogin = {
    email: "",
    password: "",
  }

  const initialValuesForSignup = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  const formik = useFormik({
    initialValues: isLogin ? initialValuesForLogin : initialValuesForSignup,
    validationSchema: isLogin ? loginValidationSchema : signupValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      try {
        setLoading(true)

        const url = isLogin
          ? "http://localhost:5001/auth/login"
          : "http://localhost:5001/auth/register"

        const response = await axios.post(url, values)

        localStorage.setItem("token", response.data.token)

        action.resetForm()

        setSuccess(isLogin ? "Login Successful" : "Signup Successful")

        setTimeout(() => {
          navigate("/chat")
        }, 1500)
      } catch (error) {
        if (import.meta.env.VITE_MODE === "DEVELOPMENT") {
          console.dir(error)
        }

        if (error.response.data.message === "User already exists.") {
          setIsError && setIsError("User already exists.")
          return
        }

        if (error.response.data.message === "User not found.") {
          setIsError && setIsError("User not found please signup to continue.")
          setTimeout(() => {
            setIsError("")
            navigate("/signup")
          }, 1500)
          return
        }

        if (error.response.data.message === "Invalid Password.") {
          setIsError && setIsError("Invalid Password.")
          return
        }

        setIsError(error.message)
      } finally {
        setLoading(false)
      }
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik

  return (
    <div className={styles.container}>
      <div
        className={`${styles.heroSection} ${
          loadState ? styles.heroLoaded : styles.heroUnloaded
        }`}
      >
        <Link to="/" className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
        </Link>

        <h1 className={styles.heading}>
          {isLogin ? "Welcome back" : "Create your account"} <br />
          <p className={styles.gradientText}>
            {isLogin
              ? "Let's pick up where you left off."
              : "Start conversations with Socketly today."}
          </p>
        </h1>

        <p className={styles.subheading}>
          {isLogin
            ? "Sign in to continue conversations with Socketly."
            : "Create an account to start conversations with Socketly."}
        </p>
      </div>

      <div
        className={`${styles.formWrapper} ${
          loadState ? styles.formLoaded : styles.formUnloaded
        }`}
      >
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            {isLogin ? "Sign in" : "Sign up"}
          </h2>

          {error && <div className={styles.errorAlertBanner}>{error}</div>}

          {success && (
            <div className={styles.successAlertBanner}>
              <CheckCircle2 className={styles.successIcon} size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
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
                    className={`${styles.input} ${styles.inputWithIcon}`}
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
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  name="email"
                  value={values.email || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={styles.input}
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
                  className={styles.input}
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

            {!isLogin && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.input}
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
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {isLogin ? "Sign In" : "Sign Up"}
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

          <p className={styles.switchAuthText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              to={isLogin ? "/signup" : "/login"}
              className={styles.switchAuthLink}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
