SCRIPTS_DIR=$( dirname -- "$0"; )
# echo $SCRIPTS_DIR

scp -r $SCRIPTS_DIR/../build/* root@vps576560.ovh.net:/opt/japanese-reviews-react
scp $SCRIPTS_DIR/../src/kanji_full.json root@vps576560.ovh.net:/opt/japanese-reviews-react/static/js
scp $SCRIPTS_DIR/../src/vocabulary_full.json root@vps576560.ovh.net:/opt/japanese-reviews-react/static/js
