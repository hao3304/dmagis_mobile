/**
 * Created by jack on 16/11/14.
 */
// const prefix = 'http://122.224.167.105/GIS/searchDam/getLegendList.jsp';
const prefix = 'http://www.dam.com.cn';
const prefix2= 'http://120.24.210.86';

function co(func) {
    return $.Deferred(function(def){
        return func.then(function(rep){
             return def.resolve(rep);
        });
    });
}

export const getDma = (params={})=>co($.getJSON(`${prefix}/GIS/searchDam/searchDam.jsp`,params));
export const getLegend = ()=>co($.getJSON(`${prefix}/GIS/searchDam/getLegendList.jsp`));
export const getDamInfo = (id)=>co($.getJSON(`${prefix}/GIS/searchDam/getDamInfo.jsp?dbid=${id}`));
export const getDamIntroduction = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamIntroduction.jsp`,{dbid:id},'text'));
export const getDamProperty = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamProperty.jsp`,{dbid:id},'text'));
export const getDamPictures = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamPictures.jsp`,{dbid:id},'text'));
export const getSearchCondition = ()=>co($.get(`${prefix}/GIS/searchDam/getSearchCondition.jsp`),{},'json');
export const getZGDWList = ()=>co($.get(`${prefix}/GIS/searchDam/getZGDWList.jsp`),{},'json');
export const getLoginInfo = ()=>co($.get(`${prefix}/GIS/getLoginInfo.jsp`),{},'json');
export const logout = ()=>co($.get(`${prefix}/GIS/logout.jsp`));
export const getDbList = ()=>co($.get(`${prefix}/GIS/addPosition/getDbList.jsp?isplaced=0`,'json'));
export const setDbPosition = (params)=>co($.get(`${prefix}/GIS/addPosition/setDbPosition.jsp`,params,'json'));
export const delDam = (id)=>co($.get(`${prefix}/GIS/addPosition/delDam.jsp`,{dbid:id},'json'));
export const doLogin = (p = {username:'',password:''})=>co($.getJSON(`${prefix}/GIS/loginOk.jsp?username=${p.username}&&password=${p.password}`));
export const getEmergency = (params)=>co($.get(`${prefix}/GIS/emergencySupport/getAccidentList.jsp`,params));
export const getAccidentInfo = (params)=>co($.get(`${prefix}/GIS/emergencySupport/getAccidentInfo.jsp`,params));
export const getAnalyseResult = (params)=>co($.get(`${prefix}/GIS/rainPicture/getAnalyseResult.jsp`,params));
export const getThemeList = (params = {})=>co($.get(`${prefix}/GIS/thematicMap/getList.jsp`,params));
export const addTheme = (params = {})=>co($.get(`${prefix}/GIS/thematicMap/add.jsp`,params));
export const editTheme = (params = {})=>co($.get(`${prefix}/GIS/thematicMap/edit.jsp`,params));
export const deleteTheme = (params = {})=>co($.get(`${prefix}/GIS/thematicMap/del.jsp`,params));
export const addIsosurface = (params = {})=>co($.get(`${prefix}/GIS/thematicMap/addIsosurface.jsp`,params));
export const getIsosurface = (params = {})=>co($.get(`${prefix}/GIS/thematicMap/getIsosurface.jsp`,params));
export const editIsosurface = (params = {})=>co($.get(`${prefix}/GIS/thematicMap/editIsosurface.jsp`,params));
export const delIsosurface = (params = {})=>co($.get(`${prefix}/GIS/thematicMap/delIsosurface.jsp`,params));
export const addSection = (params = {})=>co($.get(`${prefix}/GIS/basin/addSection.jsp`,params));
export const getSectionList = (params = {})=>co($.get(`${prefix}/GIS/basin/getSectionList.jsp`,params));
export const updateSection = (params = {})=>co($.get(`${prefix}/GIS/basin/updateSection.jsp`,params));
export const deleteSection = (params = {})=>co($.get(`${prefix}/GIS/basin/deleteSection.jsp`,params));
export const getTyphoonInfoByTfId = (params = {})=>co($.get(`${prefix}/GIS/emergencySupport/getTyphoonInfoByTfId.jsp`,params));

export const getVersion = ()=>co($.getJSON(`${prefix}/GIS/getVersion.jsp?softID=23`),{});
export const loginWithIMEI = (IMEI)=>co($.getJSON(`${prefix}/GIS/loginWithIMEI.jsp?IMEI=` + IMEI));


export const getPlaceNames = (params={})=>{
    if(params.regionType){
        return co($.getJSON(prefix2 + `/DamGIS/placename/placename!findPlaceNames.action`,{regionType:'city',...params}));
    }else{
        return co($.getJSON('./static/json/region.json'));
    }
};


export const getCustomPlaceNames = ()=>co($.get(prefix2 + '/DamGIS/placename/placename!findCustomPlaceNames.action'));
export const getRivers = ()=>co($.get(prefix + '/GIS/searchDam/getRiverTree.jsp'));
export const getRiverDam = (params)=>co($.get('/DataService.svc/RiverDam',params));
export const queryByCustomNames = (params)=>co($.get(prefix2 + '/DamGIS/placename/placename!findCustomPlaceNameListByCustomName.action',params));
export const querySubRiverIDs = (params)=>co($.get(prefix2 + '/DamGIS/river/river!findSubRivers.action',params));
export const queryHaveDamRiverList = (params)=>co($.get(prefix2 + '/DamGIS/river/river!queryHaveDamRiverList.action',params));

// export const getRegion = ()=>co($.get('http://api.rsafety.com.cn:8006/geoserver/nyc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nyc:new_dam_region&maxFeatures=50&outputFormat=JSON'));
export const getRegion = ()=>co($.get('http://223.93.186.208:8006/geoserver/nyc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nyc:dam_region&maxFeatures=50&outputFormat=JSON'));
export const getRiver = (layers,id)=>co($.get(`http://223.93.186.208:8006/geoserver/nyc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nyc:dam_river&maxFeatures=99&CQL_FILTER=RegionID=${id}&outputFormat=JSON`));
// export const getRiver = (layers,id)=>co($.get(`http://api.rsafety.com.cn:8006/geoserver/nyc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nyc:new_dam_region&maxFeatures=99&CQL_FILTER=RegionID=${id}&outputFormat=JSON`));

