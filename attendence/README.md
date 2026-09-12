# 📷 Flutter Mobile Face Recognition Attendance App

A mobile on-device **Face Recognition Attendance System** built with **Flutter (Android-first)**. Designed for office entrances and kiosks, this application performs real-time face detection with **Google ML Kit**, on-device facial feature extraction using **MobileFaceNet (TensorFlow Lite)**, and logs attendance directly into **Google Sheets** via **Google Apps Script**.

---

## ✨ Key Features

- **On-Device Face Recognition**: Extracts 192-dimensional biometric feature embeddings using MobileFaceNet via TFLite. Fast inference (<40ms), completely private, zero biometrics sent to the cloud.
- **Strict Google Sheets Integration (4 Columns Only)**: Automatically appends records to Google Sheets with **strictly and only 4 columns**: `Name`, `Date`, `Time`, `Type`.
- **Single Administrative Registration Flow**:
  - Only the Admin can log in with a PIN to register employees, capture faces, or view/edit/delete staff.
  - Employees have zero access to registration, admin routes, or settings.
  - No employee-facing registration button.
- **Intelligent Check-In / Check-Out**:
  - First scan of the day records a `Check-In`.
  - Subsequent scan on the same day records a `Check-Out`.
  - Configurable anti-bounce cooldown (e.g. 5 minutes) prevents accidental duplicate scans.
- **Offline Resiliency**: Automatically queues attendance locally if Wi-Fi drops, and syncs to Google Sheets as soon as internet connectivity is restored.
- **Premium Office Kiosk UI**: Sleek high-contrast dark theme, custom animated oval guide frame, real-time feedback status, and instant recognition confirmation cards.

---

## 📊 Google Sheets Structure

The target Google Sheet contains **ONLY these 4 columns**:

| Name | Date | Time | Type |
| :--- | :--- | :--- | :--- |
| **Rahul** | 12/09/2026 | 09:15 AM | Check-In |
| **Rahul** | 12/09/2026 | 06:05 PM | Check-Out |
| **Amit** | 12/09/2026 | 09:22 AM | Check-In |

> **Note**: Date format is strictly `DD/MM/YYYY`, time format is strictly `hh:mm A` (e.g., `09:15 AM`), and type is either `Check-In` or `Check-Out`. No other columns are added.

---

## 🚀 Google Apps Script Setup Guide

Follow these simple steps to connect your Google Sheet:

1. Open your Google Sheet at [sheets.google.com](https://sheets.google.com).
2. Click **Extensions** > **Apps Script**.
3. Clear any existing code in the editor and paste the code from [`scripts/google_apps_script.js`](file:///scripts/google_apps_script.js):

```javascript
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "Google Sheets Attendance API is online",
    columns: ["Name", "Date", "Time", "Type"]
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = lock.tryLock(10000);
  
  if (!hasLock) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server busy. Please try again."
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create strictly 4-column headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Name", "Date", "Time", "Type"]);
      sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
    }
    
    var data = JSON.parse(e.postData.contents);
    var name = data.name;
    var date = data.date;
    var time = data.time;
    var type = data.type;
    
    if (!name || !date || !time || !type) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Missing required fields (Name, Date, Time, Type)"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Append the 4 columns strictly
    sheet.appendRow([name, date, time, type]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Attendance recorded successfully",
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

4. Click **Deploy** > **New deployment**.
5. Click the gear icon next to "Select type" and select **Web app**.
6. Set the fields:
   - **Description**: `Attendance API`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial: allows mobile app to POST without OAuth login)*
7. Click **Deploy** and authorize access if prompted.
8. Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/.../exec`).

---

## 📱 App Configuration & Usage

### 1. Initial Setup
1. Launch the app on your Android device or tablet.
2. Tap the discreet **Lock Icon** in the top right corner.
3. Enter the default Admin PIN: `1234`.
4. Go to **Google Sheets & App Settings**:
   - Paste your copied Google Apps Script Web App URL.
   - Tap **Test Connection** to confirm connectivity.
   - Tap **Save URL**.
   - (Optional) Change the Admin PIN or adjust the duplicate cooldown window (default: 5 mins).

### 2. Registering Employees (Admin Only)
1. In the Admin Portal, tap **Register New Employee**.
2. Type the employee's full name (e.g. `Rahul`).
3. Have the employee look directly at the camera inside the oval guide.
4. When the indicator turns green (*"Face detected"*), tap **Capture & Register Face**.
5. The app extracts the 192-d feature vector and stores it securely on the device.

### 3. Face Attendance Scanning (Entrance Kiosk)
1. Return to the main screen (**Face Attendance Scanner**).
2. An employee stands in front of the camera.
3. The system automatically:
   - Detects their face.
   - Computes Euclidean distance against registered embeddings.
   - Identifies the employee (e.g. `Rahul`).
   - Determines `Check-In` (first scan today) or `Check-Out` (subsequent scan).
   - Posts `Rahul | 12/09/2026 | 09:15 AM | Check-In` to Google Sheets.
   - Displays the **Attendance Marked Successfully** card on screen.

---

## 🛠️ Project Structure

```text
attendence/
├── assets/
│   └── models/
│       └── mobilefacenet.tflite     # Bundled MobileFaceNet model
├── lib/
│   ├── main.dart                    # App initialization & dark theme
│   ├── models/
│   │   ├── app_settings.dart        # Admin PIN & Webhook configurations
│   │   ├── attendance_record.dart   # Exact 4-column attendance model
│   │   └── employee.dart            # Registered employee with 192-d embedding
│   ├── screens/
│   │   ├── admin/
│   │   │   ├── admin_dashboard_screen.dart # Overview & stats
│   │   │   ├── admin_employees_screen.dart # Staff directory & deletion
│   │   │   ├── admin_login_dialog.dart     # Secure PIN keypad modal
│   │   │   ├── admin_register_screen.dart  # Camera face enrollment
│   │   │   └── admin_settings_screen.dart  # Webhook URL & system configs
│   │   └── scanner/
│   │       └── scanner_screen.dart  # Main kiosk scanner with live feedback
│   ├── services/
│   │   ├── attendance_decision_service.dart # Check-In/Check-Out & cooldown
│   │   ├── camera_service.dart      # Camera streaming & face cropping
│   │   ├── face_detector_service.dart # Google ML Kit face detector
│   │   ├── face_math.dart           # Euclidean distance & vector matching
│   │   ├── recognizer_service.dart  # TFLite MobileFaceNet runner
│   │   ├── sheets_service.dart      # Google Apps Script HTTP client & queue
│   │   └── storage_service.dart     # SharedPreferences local persistence
│   └── widgets/
│       ├── attendance_success_card.dart # Recognition result popup
│       └── face_overlay_painter.dart    # Custom oval guide & laser beam
├── scripts/
│   └── google_apps_script.js        # Web App backend code for Google Sheets
└── test/
    ├── attendance_decision_service_test.dart
    ├── face_math_test.dart
    ├── models_test.dart
    ├── scaffolding_test.dart
    ├── sheets_service_test.dart
    ├── storage_service_test.dart
    └── widget_test.dart
```

---

## 🧪 Automated Testing

Run all unit and widget tests:
```bash
flutter test
```

Check static analysis and code health:
```bash
flutter analyze
```

---

## 📦 Building the Android APK

To generate the release APK for your Android kiosk device:

```bash
flutter build apk --release
```

The APK will be available at:
`build/app/outputs/flutter-apk/app-release.apk`
