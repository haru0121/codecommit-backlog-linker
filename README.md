# codecommit-backlog-linker
Code CommitへのコミットハッシュをBacklogへ紐づける

## Lambdaへデプロイ
- jsファイル作成。index.jsをLambdaのコンテンツルートに配置(index.handler)
```
npm run build
```
- Layerの作成
```
cd src
mkdir -p nodejs
cp -R node_modules nodejs/
zip -r lambda_layer.zip nodejs
```