import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:attendance_app/models/attendance_record.dart';
import 'package:attendance_app/widgets/attendance_success_card.dart';

void main() {
  testWidgets('AttendanceSuccessCard displays employee name, time, and type correctly', (WidgetTester tester) async {
    final record = AttendanceRecord(
      name: 'Rahul',
      date: '12/09/2026',
      time: '09:15 AM',
      type: 'Check-In',
      synced: true,
    );

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: AttendanceSuccessCard(
            record: record,
            onDismiss: () {},
          ),
        ),
      ),
    );

    expect(find.text('Attendance Marked Successfully'), findsOneWidget);
    expect(find.text('Rahul'), findsOneWidget);
    expect(find.text('09:15 AM'), findsOneWidget);
    expect(find.text('Check-In'), findsOneWidget);
    expect(find.text('Synced to Google Sheets'), findsNothing);
  });
}
