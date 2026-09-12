# Mobile Flutter Face Recognition Attendance App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready mobile Flutter Face Recognition Attendance application for Android with on-device face recognition (Google ML Kit + MobileFaceNet via TFLite), an isolated Admin-only registration portal, and automatic attendance logging to Google Sheets (Name, Date, Time, Type) via Google Apps Script.

**Architecture:** 
- Camera frame capture via `camera` plugin streaming to Google ML Kit Face Detection.
- Detected face bounding box cropped, resized to 112x112, normalized to `[-1, 1]`, and passed to MobileFaceNet TFLite model generating 192-dimensional embeddings.
- On-device Euclidean distance comparison against local employee roster (stored locally, never uploaded).
- Intelligent attendance determination (first scan today = Check-In, subsequent = Check-Out, 5-minute anti-bounce cooldown).
- HTTPS POST to Google Apps Script Web App writing strictly 4 columns (`Name`, `Date`, `Time`, `Type`) to Google Sheets.
- Discreet PIN-protected Admin portal for registering employees and managing staff.

**Tech Stack:** 
- Flutter 3.44+ & Dart 3.12+ (Android-first)
- `google_mlkit_face_detection`
- `tflite_flutter`
- `camera`
- `image` (for bitmap manipulation)
- `shared_preferences` & `path_provider` (for local roster and settings)
- `http` (for Google Apps Script API calls)
- `intl` (for strict `DD/MM/YYYY` and `hh:mm A` formatting)

**Spec:** [`docs/superpowers/specs/2026-09-12-face-recognition-attendance-design.md`](file:///c:/Users/mohit/OneDrive/Documents/Durga%20Manufactor/attendence/docs/superpowers/specs/2026-09-12-face-recognition-attendance-design.md)

## Global Constraints

- Android-first Flutter app; no web application.
- Target Google Sheet contains **strictly and only 4 columns**: `Name`, `Date`, `Time`, `Type`.
- Biometric face embeddings are kept 100% on the local device; never transmitted to Google Sheets.
- Single administrative registration flow: employees cannot register themselves or view admin screens.
- Cooldown logic: prevent accidental duplicate attendance within 5 minutes.
- Clean, modern kiosk UI with full-screen camera scanning area, animated oval face guide, and recognition cards.

---

### Task 1: Flutter Project Scaffolding & Android Native Configuration

**Files:**
- Create: `pubspec.yaml`
- Create: `android/app/src/main/AndroidManifest.xml`
- Create: `android/app/build.gradle`
- Create: `assets/models/mobilefacenet.tflite`
- Test: `test/scaffolding_test.dart`

**Interfaces:**
- Produces: Base Flutter environment, assets folder registered in `pubspec.yaml`, Android camera & network permissions configured, `noCompress 'tflite'` setting.

- [ ] **Step 1: Initialize Flutter project in current directory**
- [ ] **Step 2: Update `pubspec.yaml` with required dependencies and model asset**
- [ ] **Step 3: Configure `android/app/build.gradle` and `AndroidManifest.xml`**
  - Set `minSdkVersion 21`
  - Add `android.permission.CAMERA`, `android.permission.INTERNET`, `android.permission.ACCESS_NETWORK_STATE`
  - Add `aaptOptions { noCompress 'tflite' }`
- [ ] **Step 4: Provide bundled `mobilefacenet.tflite` model asset in `assets/models/`**
- [ ] **Step 5: Run `flutter pub get` and verify project compiles clean**
- [ ] **Step 6: Commit changes**

---

### Task 2: Core Data Models & Unit Tests

**Files:**
- Create: `lib/models/employee.dart`
- Create: `lib/models/attendance_record.dart`
- Create: `lib/models/app_settings.dart`
- Create: `test/models_test.dart`

**Interfaces:**
- Produces:
  - `Employee(id, name, embedding, registeredAt)` with JSON serialization.
  - `AttendanceRecord(name, date, time, type)` with JSON serialization matching exact Google Sheets contract.
  - `AppSettings(adminPinHash, scriptUrl, cooldownMinutes)`.

- [ ] **Step 1: Write failing unit test for `Employee` and `AttendanceRecord` serialization**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `Employee`, `AttendanceRecord`, and `AppSettings` models**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 3: Local Storage & Roster Service

**Files:**
- Create: `lib/services/storage_service.dart`
- Create: `test/storage_service_test.dart`

**Interfaces:**
- Consumes: `Employee`, `AttendanceRecord`, `AppSettings`
- Produces:
  - `Future<void> saveEmployee(Employee employee)`
  - `Future<List<Employee>> getEmployees()`
  - `Future<void> deleteEmployee(String id)`
  - `Future<void> updateEmployeeName(String id, String newName)`
  - `Future<void> saveAttendanceLog(AttendanceRecord record)`
  - `Future<List<AttendanceRecord>> getTodayAttendance()`
  - `Future<AppSettings> getSettings()`
  - `Future<void> updateSettings(AppSettings settings)`
  - `Future<bool> verifyAdminPin(String enteredPin)`

- [ ] **Step 1: Write unit tests for storage service (mocking SharedPreferences/file storage)**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `StorageService`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 4: Attendance Determination & Anti-Bounce Logic

**Files:**
- Create: `lib/services/attendance_decision_service.dart`
- Create: `test/attendance_decision_service_test.dart`

**Interfaces:**
- Consumes: `Employee`, `AttendanceRecord`, `StorageService`
- Produces:
  - `AttendanceDecision evaluateAttendance({required Employee employee, required List<AttendanceRecord> todayRecords, required int cooldownMinutes, required DateTime currentTime})`
  - `AttendanceDecision` returns:
    - `allowed: true`, `type: CheckIn` (if first record of the day)
    - `allowed: true`, `type: CheckOut` (if previous record exists and cooldown expired)
    - `allowed: false`, `reason: CooldownActive`, `remainingMinutes: int` (if scanned within cooldown window)

- [ ] **Step 1: Write comprehensive unit tests for Check-In, Check-Out, and Cooldown edge cases**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `AttendanceDecisionService`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 5: Face Recognition Engine (Math, Preprocessing & Vector Matching)

**Files:**
- Create: `lib/services/face_math.dart`
- Create: `lib/services/recognizer_service.dart`
- Create: `test/face_math_test.dart`

**Interfaces:**
- Produces:
  - `double euclideanDistance(List<double> v1, List<double> v2)`
  - `double cosineSimilarity(List<double> v1, List<double> v2)`
  - `RecognitionResult? matchFace(List<double> detectedEmbedding, List<Employee> roster, double threshold)`
  - `RecognizerService` wrapping TFLite interpreter for `mobilefacenet.tflite`.

- [ ] **Step 1: Write unit tests for Euclidean distance, cosine similarity, and matching logic**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `face_math.dart` and `RecognizerService`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 6: Google Apps Script Web App & Sheets Service

**Files:**
- Create: `scripts/google_apps_script.js`
- Create: `lib/services/sheets_service.dart`
- Create: `test/sheets_service_test.dart`

**Interfaces:**
- Consumes: `AttendanceRecord`, `AppSettings`
- Produces:
  - `Google Apps Script` code enforcing exactly 4 columns: `Name`, `Date`, `Time`, `Type`.
  - `SheetsService.sendAttendance(AttendanceRecord record, String webAppUrl)` returning `Future<bool>`.
  - Offline queue mechanism caching failed requests to disk and retrying when network reconnects.

- [ ] **Step 1: Write unit test for `SheetsService` with mock HTTP client**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `scripts/google_apps_script.js` and `SheetsService`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 7: Camera & ML Kit Face Detection Services

**Files:**
- Create: `lib/services/camera_service.dart`
- Create: `lib/services/face_detector_service.dart`
- Create: `lib/widgets/face_overlay_painter.dart`

**Interfaces:**
- Produces:
  - `CameraService`: manages camera lifecycle, resolution presets, image streaming.
  - `FaceDetectorService`: runs `google_mlkit_face_detection` on `InputImage`, extracts `Face` landmarks, handles orientation.
  - `FaceOverlayPainter`: renders visual scanner oval, glowing status border (cyan scanning, green recognized, red unknown/multiple).

- [ ] **Step 1: Implement `FaceDetectorService` with frame rotation converter**
- [ ] **Step 2: Implement `FaceOverlayPainter` with modern high-contrast aesthetic**
- [ ] **Step 3: Implement `CameraService` with front/back camera support**
- [ ] **Step 4: Commit changes**

---

### Task 8: Admin Authentication & Management UI

**Files:**
- Create: `lib/screens/admin/admin_login_dialog.dart`
- Create: `lib/screens/admin/admin_dashboard_screen.dart`
- Create: `lib/screens/admin/admin_register_screen.dart`
- Create: `lib/screens/admin/admin_employees_screen.dart`
- Create: `lib/screens/admin/admin_settings_screen.dart`

**Interfaces:**
- Features:
  - Secure PIN entry modal (preventing unauthorized access).
  - Employee Registration: Live camera preview, real-time face detection validator ("Ensure face is centered"), employee name input, face vector generation, and persistence.
  - Employee List: View all registered employees, registration date, delete employee, update name.
  - Admin Settings: Edit Google Apps Script URL with "Test Connection" button, change PIN, configure cooldown.

- [ ] **Step 1: Implement `admin_login_dialog.dart`**
- [ ] **Step 2: Implement `admin_dashboard_screen.dart`**
- [ ] **Step 3: Implement `admin_register_screen.dart` with face capture & quality feedback**
- [ ] **Step 4: Implement `admin_employees_screen.dart`**
- [ ] **Step 5: Implement `admin_settings_screen.dart`**
- [ ] **Step 6: Commit changes**

---

### Task 9: Main Face Attendance Kiosk Scanner UI

**Files:**
- Create: `lib/screens/scanner/scanner_screen.dart`
- Create: `lib/widgets/attendance_success_card.dart`
- Create: `lib/main.dart`

**Interfaces:**
- Features:
  - Full-screen camera scanner with modern, premium dark aesthetic.
  - Glowing animated face alignment target.
  - Status indicators: "Position your face", "Multiple faces detected", "Face not recognized", "Attendance marked".
  - Sleek overlay card on recognition:
    - **Attendance Marked Successfully**
    - **[Employee Name]** (e.g. Rahul)
    - **[Time]** (e.g. 09:15 AM)
    - **[Check-In / Check-Out]**
  - Discreet top-right lock icon to trigger Admin PIN authentication.

- [ ] **Step 1: Implement `attendance_success_card.dart`**
- [ ] **Step 2: Implement `scanner_screen.dart` integrating camera, face detector, recognizer, and sheets dispatcher**
- [ ] **Step 3: Wire up `lib/main.dart` with theme and router**
- [ ] **Step 4: Commit changes**

---

### Task 10: End-to-End Verification, Documentation & Walkthrough

**Files:**
- Create: `README.md` (Setup instructions, Google Apps Script deployment walkthrough, APK build steps)
- Update: `walkthrough.md`

- [ ] **Step 1: Run full test suite (`flutter test`)**
- [ ] **Step 2: Run `flutter analyze` and resolve any warnings or lints**
- [ ] **Step 3: Write comprehensive `README.md` with step-by-step Google Sheets setup guide**
- [ ] **Step 4: Commit and finalize walkthrough**
