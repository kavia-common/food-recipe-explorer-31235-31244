#!/bin/bash
cd /home/kavia/workspace/code-generation/food-recipe-explorer-31235-31244/food_recipe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

