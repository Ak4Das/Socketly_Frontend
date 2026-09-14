import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  FaUser,
  FaPlus,
  FaArrowLeft,
  FaChevronDown,
  FaKey,
} from "react-icons/fa"
import { BiSolidPencil } from "react-icons/bi"
import { RxEyeOpen } from "react-icons/rx"
import { PiEyeClosedDuotone } from "react-icons/pi"
import {
  sendOtp,
  updateUserProfile,
  verifyOtp,
} from "../../services/user.service"
import countries from "../../utils/countries"
import { useLoginStore } from "../../store/loginStore"
import { toast } from "react-toastify"
import { useUserStore } from "../../store/userStore.js"
import { Link, useNavigate } from "react-router-dom"
import Spinner from "../../utils/Spinner"
import { useFormik } from "formik"

// Validation schemas
import { loginValidationSchema } from "../../schemas/loginValidation.js"
import { otpValidationSchema } from "../../schemas/otpValidation.js"
import { profileValidationSchema } from "../../schemas/profileValidation.js"

// CSS Modules
import styles from "../../style/UserLogin_modules/Login.module.css"

import socketly_icon from "../../assets/images/favicon.svg"
import { ArrowLeft } from "lucide-react"

const avatars = [
  "https://ik.imagekit.io/wp5fmlbnf/Socketly_Avatar_1.webp",
  "https://ik.imagekit.io/wp5fmlbnf/Socketly_Avatar_2.webp",
  "https://ik.imagekit.io/wp5fmlbnf/Socketly_Avatar_3.webp",
  "https://ik.imagekit.io/wp5fmlbnf/Socketly_Avatar_4.webp",
  "https://ik.imagekit.io/wp5fmlbnf/Socketly_Avatar_5.webp",
  "https://ik.imagekit.io/wp5fmlbnf/Socketly_Avatar_6.webp",
]

const Login = () => {
  const step = useLoginStore((state) => state.step)
  const setStep = useLoginStore((state) => state.setStep)
  const userPhoneData = useLoginStore((state) => state.userPhoneData)
  const setUserPhoneData = useLoginStore((state) => state.setUserPhoneData)
  const resetLoginState = useLoginStore((state) => state.resetLoginState)

  const setUser = useUserStore((state) => state.setUser)
  const theme = useUserStore((state) => state.theme)

  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [profilePicture, setProfilePicture] = useState(null)
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0])
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      setError("")
    }, 5000)
  }, [error])

  const handleLogin = useFormik({
    initialValues: { phoneNumber: "", email: "", password: "" },
    validationSchema: loginValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      const { phoneNumber, email, password } = values
      try {
        if (email) {
          const response = await sendOtp(null, null, email, password)
          if (response.status === "success") {
            toast.success("OTP sent to email")
            setUserPhoneData({ email })
            setStep(2)
          }
        } else {
          const response = await sendOtp(phoneNumber, selectedCountry.dialCode)
          console.log("OTP send:", response)
          if (response.status === "success") {
            toast.info("OTP send to phone successfully")
            setUserPhoneData({
              phoneNumber,
              phoneSuffix: selectedCountry.dialCode,
            })
            setStep(2)
          }
        }
      } catch (error) {
        console.log(error)
        setError(error.message || "Failed to send OTP")
      } finally {
        action.setSubmitting(false)
        action.resetForm()
      }
    },
  })

  const handleOtp = useFormik({
    initialValues: { otp: ["", "", "", "", "", ""] },
    validationSchema: otpValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      const { otp } = values
      try {
        console.log("OTP send:", userPhoneData)
        if (!userPhoneData) {
          throw new Error("Phone data is missing")
        }
        const otpString = otp.join("")
        let response
        if (userPhoneData?.email) {
          response = await verifyOtp(null, null, otpString, userPhoneData.email)
        } else {
          response = await verifyOtp(
            userPhoneData.phoneNumber,
            userPhoneData.phoneSuffix,
            otpString,
          )
        }
        if (response.status === "success") {
          console.log("OTP verified:", response)
          toast.success("OTP verified successfully")
          const token = response?.data?.token
          localStorage.setItem("auth_token", token)
          const user = response.data?.user
          if (user?.username && user?.profilePicture) {
            setUser(user)
            toast.success("Welcome back on WhatsApp")
            navigate("/")
            resetLoginState()
          } else {
            setStep(3)
          }
        }
      } catch (error) {
        setError(error.message || "Failed to verify OTP")
      } finally {
        action.setSubmitting(false)
        action.resetForm()
      }
    },
  })

  const handleProfile = useFormik({
    initialValues: { username: "", about: "", agreed: false },
    validationSchema: profileValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      const { username, about, agreed } = values
      try {
        // Multer will parse the formData and put text fields to req.body and uploaded files to req.file / req.files
        const formData = new FormData()
        formData.append("username", username)
        formData.append("about", about)
        formData.append("agreed", agreed)
        if (profilePictureFile) {
          formData.append("profilePicture", profilePictureFile)
        } else {
          formData.append("profilePicture", selectedAvatar)
        }
        await updateUserProfile(formData)
        toast.success("welcome back on whatsapp")
        navigate("/")
        resetLoginState()
      } catch (error) {
        console.error("Error updating user profile", error)
        toast.error("Failed to update profile")
      } finally {
        action.setSubmitting(false)
        action.resetForm()
      }
    },
  })

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

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.dialCode.includes(searchTerm),
  )

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image")
        return
      }
      setProfilePictureFile(file)
      setProfilePicture(URL.createObjectURL(file)) // To access locally selected file browser create temporary blob:URL.
      setSelectedAvatar("")
    }
  }

  const ProgressBar = () => (
    <div
      className={`${styles.progressTrack} ${
        theme === "dark" ? styles.progressTrackDark : ""
      }`}
    >
      <div
        className={styles.progressBarFill}
        style={{ width: `${(step / 3) * 100}%` }}
      ></div>
    </div>
  )

  const handleGoBack = () => {
    setStep(1)
    setUserPhoneData(null)
    setError("")
    handleOtp.setFieldValue("otp", ["", "", "", "", "", ""])
  }

  return (
    <div
      className={`${styles.container} ${
        theme === "dark" ? styles.containerDark : ""
      }`}
    >
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`${styles.heroSection}`}
        >
          <Link to="/home" className={styles.backButton}>
            <ArrowLeft className={styles.backIcon} />
          </Link>

          <h1 className={styles.heading}>
            Welcome back <br />
            <p className={styles.gradientText}>
              Let's pick up where you left off.
            </p>
          </h1>

          <p className={styles.subheading}>
            Sign in to continue conversations with Socketly.
          </p>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`${styles.heroSection}`}
        >
          <Link to="/home" className={styles.backButton}>
            <ArrowLeft className={styles.backIcon} />
          </Link>

          <h1 className={styles.heading}>
            Verify OTP <br />
            <p className={styles.gradientText}>Enter the OTP sent to</p>
            <p
              className="fs-5"
              style={{ color: "#A855F7" }}
            >{`${userPhoneData.email || userPhoneData.phoneNumber}`}</p>
          </h1>

          <p className={styles.subheading}>
            Verify OTP to complete the sign in process.
          </p>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`${styles.heroSection}`}
        >
          <Link to="/home" className={styles.backButton}>
            <ArrowLeft className={styles.backIcon} />
          </Link>

          <h1 className={styles.heading}>
            Setup Account <br />
            <p className={styles.gradientText}>
              Choose profile picture and username and write about you.
            </p>
          </h1>

          <p className={styles.subheading}>
            Complete this step to successfully login with Socketly.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className={`${styles.card} ${theme === "dark" ? styles.cardDark : ""}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2, // animation will start after 0.2 seconds
            type: "spring",
            stiffness: 300, // controls how strong/stiff the spring is (higher stiffness → faster spring, lower stiffness → slower spring)
            damping: 20, // controls spring's bouncing (lower number means higher bouncing)
          }}
          className={styles.logoCircle}
        >
          <img
            src={socketly_icon}
            alt="socketly_icon"
            className={styles.logoIcon}
          />
        </motion.div>
        <h1
          className={`${styles.title} ${
            theme === "dark" ? styles.titleDark : ""
          }`}
        >
          Socketly Login
        </h1>

        <ProgressBar />

        {error && <p className={styles.errorMessage}>{error}</p>}

        {step === 1 && (
          <form onSubmit={handleLogin.handleSubmit} className={styles.form}>
            <p
              className={`${styles.subtitle} ${
                theme === "dark" ? styles.subtitleDark : ""
              }`}
            >
              Enter your phone number to receive an OTP
            </p>
            <div className={styles.relativeInputWrapper}>
              <div className={styles.phoneInputGroup}>
                <div className={styles.countryWrapper}>
                  <button
                    type="button"
                    className={`${styles.countryButton} ${
                      theme === "dark" ? styles.countryButtonDark : ""
                    }`}
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
                      className={`${styles.dropdownMenu} ${
                        theme === "dark" ? styles.dropdownMenuDark : ""
                      }`}
                    >
                      <div
                        className={`${styles.dropdownSearchSticky} ${
                          theme === "dark"
                            ? styles.dropdownSearchStickyDark
                            : ""
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="Search countries..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`${styles.dropdownSearchInput} ${
                            theme === "dark"
                              ? styles.dropdownSearchInputDark
                              : ""
                          }`}
                        />
                      </div>
                      {filteredCountries.map((country) => (
                        <button
                          key={country.alpha2}
                          type="button"
                          className={`${styles.dropdownItem} ${
                            theme === "dark" ? styles.dropdownItemDark : ""
                          }`}
                          onClick={() => {
                            setSelectedCountry(country)
                            setShowDropdown(false)
                          }}
                        >
                          {country.flag} ({country.dialCode}) {country.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={handleLogin.values.phoneNumber}
                  onChange={(e) => {
                    handleLogin.setFieldValue("phoneNumber", e.target.value)
                    setPhoneNumber(e.target.value)
                  }}
                  onBlur={handleLogin.handleBlur}
                  className={`${styles.phoneNumberInput} ${
                    theme === "dark" ? styles.phoneNumberInputDark : ""
                  } ${handleLogin.errors.phoneNumber ? styles.inputError : ""}`}
                  placeholder="Phone Number"
                />
              </div>
              {handleLogin.errors.phoneNumber &&
              handleLogin.touched.phoneNumber ? (
                <p className={styles.fieldError}>
                  {handleLogin.errors.phoneNumber}
                </p>
              ) : null}
            </div>
            <p
              className={`${styles.subtitle} ${
                theme === "dark" ? styles.subtitleDark : ""
              } mb-0 text-danger`}
            >
              SMS service is currently unavailable try with email
            </p>

            {/* Divider with OR */}
            <div className={styles.divider}>
              <div
                className={`${styles.dividerLine} ${
                  theme === "dark" ? styles.dividerLineDark : ""
                }`}
              />
              <span className={styles.dividerText}>or</span>
              <div
                className={`${styles.dividerLine} ${
                  theme === "dark" ? styles.dividerLineDark : ""
                }`}
              />
            </div>

            {/* Email Input Box with icon */}
            <div>
              <div
                className={`${styles.iconInputContainer} ${
                  theme === "dark" ? styles.iconInputContainerDark : ""
                } ${
                  handleLogin.errors.email && handleLogin.touched.email
                    ? styles.inputError
                    : ""
                }`}
              >
                <FaUser
                  className={`${styles.inputIcon} ${
                    theme === "dark" ? styles.inputIconDark : ""
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  value={handleLogin.values.email}
                  onChange={handleLogin.handleChange}
                  onBlur={handleLogin.handleBlur}
                  className={`${styles.inputField} ${
                    theme === "dark" ? styles.inputFieldDark : ""
                  }`}
                  placeholder="Email"
                />
              </div>
              {handleLogin.errors.email && handleLogin.touched.email ? (
                <p className={styles.fieldError}>{handleLogin.errors.email}</p>
              ) : null}
            </div>

            {/* Password Input Box */}
            <div>
              <div
                className={`${styles.iconInputContainer} ${
                  theme === "dark" ? styles.iconInputContainerDark : ""
                } ${
                  handleLogin.errors.password && handleLogin.touched.password
                    ? styles.inputError
                    : ""
                }`}
              >
                <FaKey
                  className={`${styles.inputIcon} ${
                    theme === "dark" ? styles.inputIconDark : ""
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={handleLogin.values.password}
                  onChange={handleLogin.handleChange}
                  onBlur={handleLogin.handleBlur}
                  className={`${styles.inputField} ${
                    theme === "dark" ? styles.inputFieldDark : ""
                  }`}
                  placeholder="Password"
                />
                {showPassword ? (
                  <RxEyeOpen
                    className={`${styles.eyeIcon} ${
                      theme === "dark" ? styles.eyeIconDark : ""
                    }`}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <PiEyeClosedDuotone
                    className={`${styles.eyeIcon} ${
                      theme === "dark" ? styles.eyeIconDark : ""
                    }`}
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              {handleLogin.errors.password && handleLogin.touched.password ? (
                <p className={styles.fieldError}>
                  {handleLogin.errors.password}
                </p>
              ) : null}
            </div>

            <button type="submit" className={styles.submitBtn}>
              {handleLogin.isSubmitting ? <Spinner /> : "Send OTP"}
            </button>

            <p className={styles.switchAuthText}>
              Have not account yet?
              <Link to="/user-signup" className={styles.switchAuthLink}>
                Sign up
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtp.handleSubmit} className={styles.form}>
            <p
              className={`${styles.subtitle} ${
                theme === "dark" ? styles.subtitleDark : ""
              }`}
            >
              Please enter the 6-digit OTP send to{" "}
              {userPhoneData.email
                ? userPhoneData.email
                : userPhoneData?.phoneSuffix.concat(userPhoneData?.phoneNumber)}
            </p>
            <div className={styles.otpGroup}>
              {handleOtp.values.otp.map((digit, index) => (
                <input
                  key={index}
                  name="otp"
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(selected) => {
                    const newOtp = [...handleOtp.values.otp]
                    newOtp[index] = selected.target.value
                    handleOtp.setFieldValue("otp", newOtp)
                    if (selected.target.value && index < 5) {
                      document.getElementById(`otp-${index + 1}`).focus()
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && index > 0) {
                      const newOtp = [...handleOtp.values.otp]
                      if (index < 5) {
                        newOtp[index - 1] = ""
                      } else {
                        newOtp[index] = ""
                      }
                      handleOtp.setFieldValue("otp", newOtp)
                      if (index <= 5) {
                        document.getElementById(`otp-${index - 1}`).focus()
                      }
                    }
                  }}
                  onBlur={() => handleOtp.setFieldTouched("otp", true)}
                  className={`${styles.otpBox} ${
                    theme === "dark" ? styles.otpBoxDark : ""
                  } ${
                    handleOtp.errors.otp && handleOtp.touched.otp
                      ? styles.inputError
                      : ""
                  }`}
                />
              ))}
            </div>
            {handleOtp.errors.otp && handleOtp.touched.otp ? (
              <p className={styles.fieldError}>{handleOtp.errors.otp}</p>
            ) : null}
            <button type="submit" className={styles.submitBtn}>
              {handleOtp.isSubmitting ? <Spinner /> : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleGoBack}
              className={`${styles.backBtn} ${
                theme === "dark" ? styles.backBtnDark : ""
              }`}
            >
              <FaArrowLeft style={{ marginRight: "0.5rem" }} />
              Go back
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleProfile.handleSubmit} className={styles.form}>
            <div className={styles.profileHeader}>
              <div className={styles.profilePicWrapper}>
                <img
                  src={profilePicture || selectedAvatar}
                  alt="Profile"
                  className={styles.profileImg}
                />
                <label htmlFor="profile-picture" className={styles.uploadLabel}>
                  <FaPlus style={{ width: "1rem", height: "1rem" }} />
                </label>
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*" // you're requesting image files only. file picker will filter out / not show files other than image files as an accepted selectable option.
                  onChange={handleFileChange}
                  className={styles.hidden}
                />
              </div>
              <p
                className={`${styles.avatarInstruction} ${
                  theme === "dark" ? styles.avatarInstructionDark : ""
                }`}
              >
                Choose an avatar:
              </p>
              <div className={styles.avatarGrid}>
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className={`${styles.avatarThumb} ${
                      selectedAvatar === avatar ? styles.avatarSelected : ""
                    }`}
                    onClick={() => {
                      setSelectedAvatar(avatar)
                      setProfilePictureFile(null)
                      setProfilePicture(null)
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className={styles.relativeInputWrapper}>
                <FaUser className={styles.absoluteIcon} />
                <input
                  type="text"
                  name="username"
                  value={handleProfile.values.username}
                  onChange={handleProfile.handleChange}
                  onBlur={handleProfile.handleBlur}
                  placeholder="Username"
                  className={`${styles.paddedInput} ${
                    theme === "dark" ? styles.paddedInputDark : ""
                  }`}
                />
              </div>
              {handleProfile.errors.username &&
              handleProfile.touched.username ? (
                <p className={`${styles.fieldError} mb-0`}>
                  {handleProfile.errors.username}
                </p>
              ) : null}
            </div>
            <div className={styles.relativeInputWrapper}>
              <BiSolidPencil className={styles.absoluteIcon} />
              <input
                type="text"
                name="about"
                value={handleProfile.values.about}
                onChange={handleProfile.handleChange}
                onBlur={handleProfile.handleBlur}
                placeholder="About"
                className={`${styles.paddedInput} ${
                  theme === "dark" ? styles.paddedInputDark : ""
                }`}
              />
            </div>
            <div>
              <div className={styles.termsWrapper}>
                <input
                  type="checkbox"
                  name="agreed"
                  checked={handleProfile.values.agreed}
                  onChange={handleProfile.handleChange}
                  onBlur={handleProfile.handleBlur}
                  id="terms"
                  className={styles.checkbox}
                />
                <label
                  htmlFor="terms"
                  className={`${styles.termsLabel} ${
                    theme === "dark" ? styles.termsLabelDark : ""
                  }`}
                >
                  I agree to the{" "}
                  <a href="#" className={styles.termsLink}>
                    Terms and Conditions
                  </a>
                </label>
              </div>
              {handleProfile.errors.agreed && handleProfile.touched.agreed ? (
                <p className={`${styles.fieldError} mb-0`}>
                  {handleProfile.errors.agreed}
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={handleProfile.isSubmitting}
              className={`${styles.profileSubmitBtn} ${
                handleProfile.isSubmitting ? styles.btnDisabled : ""
              }`}
            >
              {handleProfile.isSubmitting ? <Spinner /> : "Create Profile"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}

export default Login
