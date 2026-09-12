# Mobile Flutter Face Recognition Attendance App — Design Specification

**Date:** 2026-09-12  
**Status:** Approved  
**Platform:** Flutter (Android-first)

---

## 1. Executive Summary

This project delivers a production-ready, on-device Face Recognition Attendance System built with Flutter for Android. The system acts as a smart entrance kiosk or mobile attendance recorder. It uses Google ML Kit for real-time face detection and MobileFaceNet via TensorFlow Lite for on-device facial feature extraction and matching. 

Attendance records are transmitted directly to Google Sheets via a dedicated Google Apps Script Web App endpoint. The target Google Sheet contains **strictly and only 4 columns**: `Name`, `Date`, `Time`, and `Type`.

To ensure strict access control, only authorized Admins (authenticated via secure PIN) can access the registration interface and employee directory. Employees have access solely to the automated Face Attendance Scanner.

---

## 2. Core Constraints & Guarantees

1. **No Web App**: Pure mobile Flutter application for Android.
2. **Biometrics Privacy**: Raw face embeddings are stored exclusively on-device in secure local storage and are **never** sent to Google Sheets or third-party servers.
3. **Exact 4 Columns in Google Sheets**:
   - Column A: `Name`
   - Column B: `Date` (Format: `DD/MM/YYYY`)
   - Column C: `Time` (Format: `hh:mm A`, e.g., `09:15 AM`)
   - Column D: `Type` (`Check-In` or `Check-Out`)
4. **Single Administrative Registration Flow**:
   - Employees cannot register themselves or access any admin settings.
   - Admin authentication is mandatory before any employee can be added, updated, or removed.
5. **Intelligent Attendance Determination**:
   - First scan of the day records a `Check-In`.
   - Subsequent scan on the same day records a `Check-Out`.
   - An anti-bounce cooldown (e.g., 5 minutes) prevents accidental duplicate logs.

---

## 3. System Architecture

```text
               ┌─────────────────────────────────────────┐
               │         Flutter Android Client          │
               │                                         │
               │  ┌─────────────────┐ ┌───────────────┐  │
               │  │ Face Attendance │ │  Admin Portal │  │
               │  │  Scanner (Main) │ │ (PIN Guarded) │  │
               │  └────────┬────────┘ └───────┬───────┘  │
               │           │                  │          │
               │           ▼                  ▼          │
               │     ML Kit Detector     Admin Camera    │
               │           │             Face Capture    │
               │           ▼                  │          │
               │    TFLite MobileFaceNet      │          │
               │     192-d Vector Match       │          │
               │           │                  │          │
               │           ▼                  ▼          │
               │    Local Secure Storage (Roster + Cache)│
               │           │                             │
               └───────────┼─────────────────────────────┘
                           │ HTTPS POST (Queue & Sync)
                           ▼
               ┌─────────────────────────────────────────┐
               │       Google Apps Script Web App        │
               │             doPost(e) API               │
               └───────────────────┬─────────────────────┘
                                   │
                                   ▼
               ┌─────────────────────────────────────────┐
               │              Google Sheets              │
               │       [Name | Date | Time | Type]       │
               └─────────────────────────────────────────┘
```

---

## 4. Detailed Component Specifications

### 4.1. Vision & ML Pipeline

1. **Camera Feed (`CameraService`)**:
   - Uses `camera` plugin with front-facing camera set by default.
   - Feeds image stream (`CameraImage`) to face detector with appropriate rotation handling based on sensor orientation (`InputImageRotation`).
2. **Face Detection (`FaceDetectorService`)**:
   - Uses `google_mlkit_face_detection`.
   - Evaluates frame conditions:
     - `no_face`: Prompts user to center their face.
     - `multiple_faces`: Flags warning to scan one individual at a time.
     - `face_detected`: Crops bounding box with standard aspect ratio expansion.
3. **Face Embedding & Recognition (`RecognizerService`)**:
   - Model: Quantized `mobilefacenet.tflite` (112x112 input, 192 output dimensions).
   - Normalization: RGB channels scaled `(pixel - 127.5) / 128.0`.
   - Metric: Euclidean distance $d(u, v) = \sqrt{\sum (u_i - v_i)^2}$.
   - Recognition Threshold: $d \le 0.85$ matches a registered employee.
   - Multi-candidate disambiguation: Selects candidate with minimum distance below threshold.

### 4.2. Local Storage & Roster (`StorageService`)

- **Employee Entity**:
  ```dart
  class Employee {
    final String id;
    final String name;
    final List<double> embedding; // 192-d vector
    final DateTime registeredAt;
  }
  ```
- **Local Attendance Log**: Tracks attendance state per employee ID for the current calendar day to determine Check-In vs Check-Out and enforce the 5-minute cooldown.
- **Admin Configuration**:
  - Encrypted Admin PIN (default: `1234`).
  - Google Apps Script Web App Deployment URL.
  - Cooldown duration (in minutes).

### 4.3. Google Sheets & Apps Script Integration (`SheetsService`)

- **Request Contract**:
  ```http
  POST <GOOGLE_APPS_SCRIPT_WEB_APP_URL>
  Content-Type: application/json

  {
    "name": "Rahul",
    "date": "12/09/2026",
    "time": "09:15 AM",
    "type": "Check-In"
  }
  ```
- **Response Contract**:
  ```json
  {
    "status": "success",
    "message": "Row added successfully",
    "row": 42
  }
  ```
- **Offline Resiliency**: In case of network interruption, requests are placed in an on-device FIFO sync queue. The app retries pending items upon reconnection.

### 4.4. UI & UX Architecture

1. **Face Attendance Scanner Screen (`ScannerScreen`)**:
   - Fullscreen camera preview with dark glassmorphic overlay.
   - Oval face guide frame with animated scanning beam or status ring (Cyan/Blue scanning, Emerald Green on match, Crimson on unknown/error).
   - Real-time status badge ("Align Face", "Recognizing...", "Attendance Logged").
   - Success overlay displaying:
     - **Attendance Marked Successfully**
     - **[Employee Name]**
     - **[Time]**
     - **[Check-In / Check-Out]**
   - Top corner discreet Admin icon requiring PIN unlock.

2. **Admin Authentication Dialog**:
   - Clean 4-digit PIN pad overlay.
   - Biometric or PIN recovery option.

3. **Admin Dashboard (`AdminDashboardScreen`)**:
   - Roster summary (total registered employees).
   - Navigation:
     - **Register Employee**: Live camera capture with quality guide (face detected check), name input, save embedding.
     - **Manage Employees**: Searchable list of registered staff with options to delete or re-register face.
     - **App Settings**: Edit Google Apps Script Webhook URL, change Admin PIN, set cooldown duration.

---

## 5. Google Apps Script Code Design

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure header row exists with exactly 4 columns
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

---

## 6. Verification & Test Plan

1. **Unit Tests**:
   - Math tests for Euclidean distance and embedding normalization.
   - Attendance status determination logic (First of day -> Check-In; subsequent -> Check-Out).
   - Cooldown timer expiry validation.
   - Date and Time formatting matching `DD/MM/YYYY` and `hh:mm A`.
2. **Integration Verification**:
   - HTTP dispatch validation to mock Apps Script service.
   - Local database persistence and retrieval of employee vectors.
3. **App Build & Sanity Check**:
   - `flutter analyze` passes with zero errors.
   - `flutter test` executes and succeeds.
