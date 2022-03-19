xcopy /y /c /h /r /s /i "serverless\*" "dist\serverless"
xcopy /y /c /h /r /s /i ".nuxt" "dist\serverless\.nuxt"
xcopy /y /c /h /r /s /i "static" "dist\serverless\static"
xcopy /y "nuxt.config.js" "dist\serverless\"