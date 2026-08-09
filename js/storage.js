window.BNM = window.BNM || {};

BNM.storage = (function(){
  const KEYS = {
    favorites: "bnm_favorites_v1",
    ratings: "bnm_ratings_v1",
    currentAdventure: "bnm_current_adventure_v1"
  };

  function read(key, fallback){
    try{
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    }catch(e){ return fallback; }
  }

  function write(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){}
  }

  function favorites(){ return read(KEYS.favorites, []); }
  function isFavorite(id){ return favorites().includes(id); }
  function toggleFavorite(id){
    const list = favorites();
    const next = list.includes(id) ? list.filter(x=>x!==id) : [...list,id];
    write(KEYS.favorites,next);
    BNM.track("favorite_toggle",{activity:id,saved:next.includes(id)});
    return next.includes(id);
  }

  function saveRating(id, rating){
    const ratings = read(KEYS.ratings,{});
    ratings[id] = {rating, ratedAt:new Date().toISOString()};
    write(KEYS.ratings, ratings);
    BNM.track("activity_rated",{activity:id,rating});
  }

  function setCurrentAdventure(activity){
    write(KEYS.currentAdventure,{id:activity.id,startedAt:new Date().toISOString()});
  }

  function clearCurrentAdventure(){
    try{ localStorage.removeItem(KEYS.currentAdventure); }catch(e){}
  }

  return {favorites,isFavorite,toggleFavorite,saveRating,setCurrentAdventure,clearCurrentAdventure};
})();
