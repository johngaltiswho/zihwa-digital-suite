# Humility DB API Reference

## Authentication

All API routes require Vendure authentication via session cookie. User must be logged in through Vendure before accessing any endpoints.

**Authentication Flow:**
1. User logs in via Vendure auth context (`useAuth()` hook)
2. Session cookie automatically included in requests
3. API validates activeCustomer
4. Student record auto-created/synced on first access

---

## Video Endpoints

### Upload Video

**POST** `/api/videos/upload`

Upload a video for technique analysis.

**Auth Required:** Yes
**Subscription Required:** Any active subscription (FREE, BASIC, or PREMIUM)

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `video`: File (mp4, mov, or avi, max 100MB)

**Upload Limits by Tier:**
- FREE: 1 video per month
- BASIC: 3 videos per month
- PREMIUM: Unlimited

**Response (Success - 200):**
```json
{
  "success": true,
  "videoId": "clx123abc",
  "message": "Video uploaded successfully. Processing will begin shortly.",
  "video": {
    "id": "clx123abc",
    "fileName": "my-technique.mp4",
    "fileUrl": "https://supabase.co/storage/.../videos/...",
    "status": "UPLOADED",
    "uploadedAt": "2026-03-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Not authenticated
- `403`: Subscription required or upload limit reached
- `400`: Invalid file (wrong type or too large)
- `500`: Upload failed

**Example (curl):**
```bash
curl -X POST http://localhost:3006/api/videos/upload \
  -F "video=@my-technique.mp4" \
  -H "Cookie: vendure-session-token=YOUR_SESSION_TOKEN"
```

---

### Get Video Status

**GET** `/api/videos/[id]/status`

Check processing status and get analysis results.

**Auth Required:** Yes
**Ownership Check:** User must own the video

**Response (Success - 200):**
```json
{
  "video": {
    "id": "clx123abc",
    "fileName": "my-technique.mp4",
    "fileUrl": "https://...",
    "status": "COMPLETED",
    "uploadedAt": "2026-03-01T12:00:00.000Z",
    "processingStartedAt": "2026-03-01T12:00:05.000Z",
    "processingCompletedAt": "2026-03-01T12:02:30.000Z"
  },
  "analyses": [
    {
      "id": "clx456def",
      "frameNumber": 1,
      "timestamp": 0.0,
      "frameUrl": "https://.../frames/.../frame-001.jpg",
      "formScore": 85,
      "positioningScore": 90,
      "feedback": "Good hip angle and arm control. Focus on tightening leg position.",
      "strengths": ["Good hip angle", "Proper arm control"],
      "improvements": ["Tighten leg position", "Adjust head placement"]
    }
  ],
  "summary": {
    "avgFormScore": 87,
    "avgPositioningScore": 88,
    "count": 10
  }
}
```

**Video Status Values:**
- `UPLOADED`: Just uploaded, not processed yet
- `PROCESSING`: Currently extracting frames and analyzing
- `COMPLETED`: Analysis complete, results available
- `FAILED`: Processing error occurred

**Error Responses:**
- `401`: Not authenticated
- `403`: Not authorized (video belongs to another user)
- `404`: Video not found

---

### Process Video (On-Demand)

**POST** `/api/videos/process`

Trigger processing for an uploaded video.

**Auth Required:** Yes
**Ownership Check:** User must own the video

**Request:**

```json
{
  "videoId": "clx123abc"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "videoId": "clx123abc",
  "status": "COMPLETED"
}
```

**Error Responses:**
- `400`: Missing videoId
- `401`: Not authenticated
- `403`: Not authorized (video belongs to another user)
- `404`: Video not found

---

## Future Endpoints (Not Yet Implemented)

### Copilot Chat

**POST** `/api/copilot/actions` (Coming in Phase 4)

Interact with the BJJ copilot for questions, training plans, and video analysis.

### Techniques

**GET** `/api/techniques` (Coming in Phase 5)

List all published techniques with optional filtering by category, position, or difficulty.

### Progress Tracking

**GET** `/api/progress` (Coming in Phase 5)

Get student's progress across all techniques.

**POST** `/api/progress/track` (Coming in Phase 5)

Log a practice session for a technique.

### Training Plans

**GET** `/api/training-plans` (Coming in Phase 5)

Get active training plans for the student.

**POST** `/api/training-plans` (Coming in Phase 5)

Create a new training plan (AI-generated or manual).

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Description of what went wrong",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Error Codes:**
- `AUTH_REQUIRED`: User not logged in
- `SUBSCRIPTION_REQUIRED`: Active subscription needed
- `UPLOAD_LIMIT_REACHED`: Monthly video limit exceeded
- `INVALID_FILE`: File validation failed
- `INVALID_REQUEST`: Request payload is missing/invalid
- `NOT_FOUND`: Resource doesn't exist
- `UNAUTHORIZED`: User doesn't own the resource
- `SERVER_ERROR`: Internal error occurred

---

## Rate Limiting (Future)

Rate limits will be enforced based on subscription tier:

| Tier | Video Uploads | Copilot Messages | API Requests |
|------|---------------|------------------|--------------|
| FREE | 1/month | 5/day | 100/hour |
| BASIC | 3/month | Unlimited | 500/hour |
| PREMIUM | Unlimited | Unlimited | 1000/hour |

---

## Webhook Events (Future)

When certain events occur, webhooks can be triggered:

- `video.uploaded` - New video uploaded
- `video.processing_started` - Processing began
- `video.processing_completed` - Analysis complete
- `video.processing_failed` - Processing error
- `training_plan.created` - New plan generated
- `training_plan.completed` - All items finished

---

## Development Testing

### Using Postman/Insomnia:

1. **Login via Vendure first:**
   ```
   POST http://localhost:3100/shop-api
   GraphQL: mutation { login(...) }
   ```

2. **Copy session cookie from response**

3. **Use cookie in subsequent requests:**
   - Add Cookie header: `vendure-session-token=YOUR_TOKEN`

### Using curl:

```bash
# 1. Login (get session token from response headers)
curl -X POST http://localhost:3100/shop-api \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(username:\"user@example.com\", password:\"password\") { ... on CurrentUser { id } } }"}' \
  -c cookies.txt

# 2. Upload video (uses saved cookies)
curl -X POST http://localhost:3006/api/videos/upload \
  -F "video=@test.mp4" \
  -b cookies.txt
```

---

## Security Notes

- All endpoints validate Vendure session
- Students can only access their own data
- Subscription tier checked before premium features
- File uploads validated (type, size)
- SQL injection prevented via Prisma ORM
- XSS prevented via Next.js automatic escaping
