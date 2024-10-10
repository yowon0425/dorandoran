from flask import Flask, render_template, request, redirect, url_for
import sqlite3
from datetime import datetime
import cv2

app = Flask(__name__)

# SQLite DB 초기화 및 테이블 생성
def init_db():
    conn = sqlite3.connect('dorandoran.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS VoiceInput (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            input_text TEXT NOT NULL,
            input_time TEXT NOT NULL,
            youtube_url TEXT
        )
    ''')
    conn.commit()
    conn.close()

# 데이터베이스에 음성 인식 입력 데이터 저장
def save_input(input_text, youtube_url=None):
    conn = sqlite3.connect('dorandoran.db')
    cursor = conn.cursor()
    input_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute('INSERT INTO VoiceInput (input_text, input_time, youtube_url) VALUES (?, ?, ?)', (input_text, input_time, youtube_url))
    conn.commit()
    conn.close()

# 관리자 페이지: 네비게이터와 기본 페이지
@app.route('/admin')
def admin():
    return render_template('admin.html')

# 첫 번째 페이지: 재생리스트
@app.route('/admin/playlist')
def playlist():
    conn = sqlite3.connect('dorandoran.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM VoiceInput')
    records = cursor.fetchall()
    conn.close()
    return render_template('playlist.html', records=records)

# 두 번째 페이지: 데이터웨어하우스 (데이터 클라우드)
@app.route('/admin/data_warehouse')
def data_warehouse():
    conn = sqlite3.connect('dorandoran.db')
    cursor = conn.cursor()
    cursor.execute('SELECT input_text, COUNT(input_text) FROM VoiceInput GROUP BY input_text')
    word_frequency = cursor.fetchall()
    conn.close()
    return render_template('data_warehouse.html', word_frequency=word_frequency)

# 세 번째 페이지: 영상인식 (OpenCV 예제)
# Flask 코드에서 OpenCV 실행
# Flask 코드에서 OpenCV 실행
@app.route('/admin/video_recognition')
def video_recognition():
    # OpenCV로 얼굴 인식 이미지를 처리하고 저장
    filename = "static/face_detection.png"
    capture_and_save_image(filename)
    
    # 처리된 이미지를 HTML 페이지에 표시
    return render_template('video_recognition.html', image_file=filename)

def capture_and_save_image(output_file):
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    if not ret:
        cap.release()
        raise Exception("프레임을 읽어오지 못했습니다.")
    
    # 얼굴 인식 처리
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

    # 처리된 이미지를 파일로 저장
    cv2.imwrite(output_file, frame)
    cap.release()


# 음성 입력 저장을 위한 엔드포인트 (예: POST 요청으로 음성 입력 저장)
@app.route('/save_input', methods=['POST'])
def save_voice_input():
    input_text = request.form.get('input_text')
    youtube_url = request.form.get('youtube_url')
    if input_text:
        save_input(input_text, youtube_url)
    return redirect(url_for('playlist'))

if __name__ == '__main__':
    init_db()  # SQLite 데이터베이스 초기화
    app.run(debug=True)  # Flask 애플리케이션 실행
