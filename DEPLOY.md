# Deploy to Railway (Free)

## Steps:

1. **Create Railway Account**: Go to https://railway.app and sign up with GitHub

2. **Push to GitHub**: 
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy on Railway**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect and deploy

4. **Set Environment Variable**:
   - In Railway dashboard, go to Variables tab
   - Add: `GEMINI_API_KEY` = `AIzaSyATz1nPZxGT1JtDq653bpauGDqz-OMUGKo`

5. **Access Your App**: Railway will provide a public URL like `https://yourapp.up.railway.app`

## Alternative: Render (Free)

1. Go to https://render.com
2. Connect GitHub repo
3. Choose "Web Service"
4. Build: `cd frontend && npm install && npm run build && mkdir -p ../backend/src/main/resources/static && cp -r build/* ../backend/src/main/resources/static/ && cd ../backend && mvn clean package -DskipTests`
5. Start: `java -jar backend/target/logo-builder-0.0.1-SNAPSHOT.jar`