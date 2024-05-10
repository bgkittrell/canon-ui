# Deploy Vue to s3
echo "Deploying Vue to s3"
echo "Building Vue"
npm run build
echo "Deploying Vue to s3"
aws s3 sync dist/ s3://bb-front-end --delete
echo "Invalidating Cloudfront"
# Invalidate Cloudfront and capture invalidation id
aws cloudfront create-invalidation --distribution-id EAO6JZ11Z5PSN --paths "/*" | tee invalidation.json
echo "Waiting for invalidation to complete"
aws cloudfront wait invalidation-completed --distribution-id EAO6JZ11Z5PSN --id $(jq -r '.Invalidation.Id' invalidation.json)
rm invalidation.json
echo "Vue deployed to s3"