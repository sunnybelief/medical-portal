(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by roper on 2017/9/11.
 */
$(document).ready(function () {
  (function ($) {

    //全局变量-监测表
    let accidentId;  //数字减影不良事件观察表ID
    let observeId; //数字减影血管造影机监测观察表ID
    let patientName; //患者姓名
    let flowLog; // 审批流程日志JSON:  [{stepName:XXX市级中心审阅通过提交省级, stepDate:2017-09-13},{}]
    let status; //报告状态直接存中文：暂存、待评价、已评价、市级已退回、省级已退回
    let equipmentId; //具体的机器ID   MEDIC_EQUIPMENT_DETAIL 表
    let equipmentCategory; //机器类别，直接存中文：数字减影血管造影机......
    let reportOrgId;     //上报单位ID
    let reportOrgName;    //上报单位名称：辽宁省-沈阳市 沈阳市第一医院
    let reportorId = window.localStorage.userIdKey; //报告人ID
    let reportorName = window.localStorage.fullNameKey;  //报告人名称

    let hasAccident;  //是否发生不良事件：N 否\nY 是
    let evaluateBrief; //评价意见
    let usedOfficeSelect; //使用科室：直接存中文：介入科导管室、影像科放射科、其他
    let usedOfficeOther; //使用科室-其他
    let patientSex; //0 女\n1 男
    let patientAgeSelect; //患者年龄：直接存中文：年龄、出生日期
    let patientAgeY; //年龄选项：23 不论年龄选项是否选择，这一项都要实时计算录入，数据统计会用到
    let patientAgeU; //年龄单位：岁、月、周
    let patientAgeB; //出生日期选项：2017年09月18
    let checkInNumber; //住院号
    let diagnosis; //临床诊断
    let operationName; //手术名称
    let equipmentExposure; //曝光量
    let equipmentDuration;//使用时长
    let equipmentStartTime; //开始时间
    let equipmentEndTime;//结束时间
    let injectorName; //注射器设备名称
    let injectorFactory; //注射器生产企业
    let injectorSpec;  //注射器规格型号
    let injectorHowUse; //注射器使用方法
    let injectorStartTime; //开始时间
    let injectorEndTime; //结束时间
    let accidentDesktopSelect; //造影机操作台：直接存中文：无法启动、跳闸自动关机、高温报警、启动后无法工作、其他
    let accidentDesktopOther; //造影机操作台其他
    let accidentCSelect; //C型臂球馆：直接存中文：无法移动旋转、球管过热、球管出现打火现象、无射线不曝光、光圈异常、其他
    let accidentCOther; //C型臂球馆其他
    let accidentImgSelect; //图像情况：直接存中文：图像不能保存、有射线无图像、出现伪影、出现亮线、图像模糊难以识别、其他
    let accidentImgOther;  //图像情况其他
    let accidentBedSelect; //手术床：直接存中文：床面断电、无法移动、不能锁定、突然解锁移动、输液架无法固定
    let accidentPartSelect;  //设备部件：直接存中文：防护铅板脱落、C型臂脱落、其他
    let accidentPartOther; //设备部件其他
    let accident6Select; //6：直接存中文：医患出现明显的射线灼伤，其他
    let accident6Other;//6其他
    let accident7Select; //7：直接存中文：机器卷入异物无法正常运转，其他
    let accident7Other;  //7其他

    //不良事件报告表
    let harmHappenTimeSelect;//不良事件发生时间，直接存中文：临床使用期间、设备日常维护监测期间
    let harmCourseSelect;//不良事件过程描述-是否涉及造影机故障：直接存中文：是、否
    let harmCourseDescription; //不良事件过程描述文本
    let harmProcessSelect;//不良事件处理情况radio：直接存中文：不需处理自动恢复、重启设备后恢复、更换设备后短时暂停、手术中止维修设备
    let harmProcessStopDuring;//不良事件处理情况中的短时暂停时间
    let harmProcessDescription; //不良时间处理情况-处理措施具体描述
    let harmReasonText;//事件发生初步原因分析
    let harmEquipmentRepair;//设备维修后的情况
    let harmLevelSelect;//不良事件严重程度radio：直接存中文：对患者无影响、一般、严重',
    let harmTerribleLevelSelect;//不良事件严重程度-如果是严重：直接存中文：死亡、危及生命、机体功能结构永久性损伤、需要内外科治疗避免上述永久性损伤',
    let harmResultSelect;//不良事件的结果：痊愈、有后遗症、死亡',
    let harmResultRecoveryTime;//不良事件的结果-转归时间',
    let harmResultSequela;//不良事件的结果-后遗症表现',
    let harmResultDiedTime;//不良事件的结果-死亡时间',
    let harmResultDiedReason;//不良事件的结果-直接死因',
    let harmOriginalSelect;//对原患疾病的影响：直接存中文：不明显、病程延长、病情加重、导致后遗症、导致死亡',
    let harmOriginalSequela;//对原患疾病的影响-后遗症表现',
    let harmOriginalDiedTime;//对原患疾病的影响-死亡时间',
    let harmSelfRelativeEvaluate1;//不良事件关联性评价-自评-第一项-直接存中文：是、否',
    let harmSelfRelativeEvaluate2;//不良事件关联性评价-自评-第二项-直接存中文：是、否',
    let harmSelfRelativeEvaluate3;//不良事件关联性评价-自评-第三项-直接存中文：是、否',
    let harmSelfRelativeResult;//自评-与数字减影血管造影机的因果关系评价-直接存中文：很有可能、可能有关、可能无关、无法确定',
    let superiorRelativeEvaluate1;//不良事件关联性评价-上级评-第一项-直接存中文：是、否',
    let superiorRelativeEvaluate2;//不良事件关联性评价-上级评-第二项-直接存中文：是、否',
    let superiorRelativeEvaluate3;//不良事件关联性评价-上级评-第三项-直接存中文：是、否',
    let superiorRelativeResult;//上级评-与数字减影血管造影机的因果关系评价-直接存中文：很有可能、可能有关、可能无关、无法确定',
    let technologyIsHarmSituation;//上级评-监测技术机构评价意见-是否医疗器械不良事件-直接存中文：是、否',
    let technologyProcessTip;//上级评-监测技术机构评价意见-处理意见-直接存中文：不符合报告标准、继续监测、进一步处理',
    let technologyTipDescription;//监测技术机构评价意见-意见陈述',

    //初始化一些页面基本元素
    initElement();
    function initElement() {
      //渲染步骤进度条
      $('#rootwizard').bootstrapWizard({'tabClass': 'bwizard-steps'});
      $('#J_office_birthday').datepicker({
        todayBtn: "linked",
        language: "zh-CN",
        orientation: "bottom auto",
        autoclose: true
      });

      $('#J_org_select').select2();
      $('#J_equipment_select').select2();

      //初始化医疗器械select2控件
      $('#J_org_select').on("change", function (e) {
        initEquipmentSelect($('#J_org_select').val());
      });

      //初始化设备选择控件
      function initEquipmentSelect(orgId) {
        $('#J_equipment_select').find('option').remove();
        $("#J_equipment_select").val(null).trigger("change");
        $.ajax({
          url: window.localStorage.backSystemUrl + '/get/all/equipment/by/orgIdAndCategory',
          headers: {
            Authorization: "Bearer " + window.localStorage.myTokenKey
          },
          method: 'get',
          data: {
            orgId: orgId,
            categoryId: $('input[name="categoryId"]').val()
          },
          success: function (result) {
            let resultJson = JSON.parse(result);
            $('#J_equipment_select').select2({
              data: resultJson.object,
              placeholder: '请选择',
            });
          }
        });

      }
    }

    //绑定输入和radio的对应选择关系
    bindRadioAndOther();
    function bindRadioAndOther() {

      //监测观察表
      $('#J_office_other').on('click', function () {
        $("input[name='office']").get(2).checked = true;
      });

      $('#J_office_birthday').on('click', function () {
        $("input[name='old']").get(1).checked = true;
      });

      $('#J_office_old').on('click', function () {
        $("input[name='old']").get(0).checked = true;
      });

      $('#J_bad_desk_other').on('click', function () {
        $("input[name='badDesk']").get(4).checked = true;
      });

      $('#J_bad_c_other').on('click', function () {
        $("input[name='badC']").get(5).checked = true;
      });

      $('#J_bad_image_other').on('click', function () {
        $("input[name='badImage']").get(6).checked = true;
      });

      $('#J_bad_part_other').on('click', function () {
        $("input[name='badPart']").get(2).checked = true;
      });

      $('#J_bad_radiate_other').on('click', function () {
        $("input[name='badRadiate']").get(1).checked = true;
      });

      $('#J_bad_matter_other').on('click', function () {
        $("input[name='badMatter']").get(1).checked = true;
      });

      //不良事件报告表
      $('#J_harm_operate_during').on('click', function () {
        $("input[name='harmOperate']").get(2).checked = true;
      });

      $('input[type="radio"][name="harmSeriousDetail"]').change(function () {
        $("input[name='harmSerious']").get(2).checked = true;
      });

      $('input[type="radio"][name="harmSerious"]').change(function () {
        if ($(this).value !== '严重') {
          $("input[name='harmSeriousDetail']").get(0).checked = false;
          $("input[name='harmSeriousDetail']").get(1).checked = false;
          $("input[name='harmSeriousDetail']").get(2).checked = false;
          $("input[name='harmSeriousDetail']").get(3).checked = false;
        }
      });


      $('#J_harm_gout_time').on('click', function () {
        $("input[name='harmResult']").get(0).checked = true;
      });

      $('#J_harm_sequel').on('click', function () {
        $("input[name='harmResult']").get(1).checked = true;
      });

      $('#J_harm_died_time,#J_harm_died_reason').on('click', function () {
        $("input[name='harmResult']").get(2).checked = true;
      });

      $('#J_original_sequel').on('click', function () {
        $("input[name='harmOriginal']").get(3).checked = true;
      });

      $('#J_original_died_time').on('click', function () {
        $("input[name='harmOriginal']").get(4).checked = true;
      });

    }

    //如果是从暂存继续填写或者修改处进来的，则需要将原来的数据填写
    initAlreadyVar();
    function initAlreadyVar() {
      var observeId = $('input[name="ObserveReportId"]').val();
      var accidentId = $('input[name="AccidentReportId"]').val();

      if (isNull(observeId)) {
        //初始化监测地点select2控件
        if (window.localStorage.orgLevelKey !== 'HOSPITAL') {
          //这说明是市级或者省级代替医院来填写报告，那么此时选择范围是所有的医院，否则就是当前账号所属的医院自己
          $.ajax({
            url: window.localStorage.backSystemUrl + '/get/all/hospital',
            headers: {
              Authorization: "Bearer " + window.localStorage.myTokenKey
            },
            method: 'get',
            data: {},
            success: function (result) {
              let resultJson = JSON.parse(result);
              $('#J_org_select').select2({
                data: resultJson.object,
                placeholder: '请选择',
              }).val([(resultJson.object)[0].id]).trigger("change");
            }
          });

        } else {
          $('#J_org_select').select2({
            data: [{
              id: window.localStorage.orgIdKey,
              text: window.localStorage.addressCityKey + ' ' + window.localStorage.orgNameKey
            }],
            placeholder: '请选择',
          }).val([window.localStorage.orgIdKey]).trigger("change");//当前账号所在单位
        }

        //初始化报告人：在observeId为空，也就是填写空表的时候，报告人即为当前账号,否则为获取到的监测表数据
        $('.local-report-name').text(window.localStorage.fullNameKey);
      } else {
        //获取监测表数据
        $.ajax({
          url: window.localStorage.backSystemUrl + '/query/DSA/report/by/observeId',
          headers: {
            Authorization: "Bearer " + window.localStorage.myTokenKey
          },
          method: 'get',
          data: {observeId: observeId},
          success: function (result) {
            let resultJson = JSON.parse(result);
            if (resultJson.successful && resultJson.object) {
              var reportData = resultJson.object;
              //初始化监测地点
              if (reportData.reportOrgId) {
                $.ajax({
                  url: window.localStorage.backSystemUrl + '/get/all/hospital',
                  headers: {
                    Authorization: "Bearer " + window.localStorage.myTokenKey
                  },
                  method: 'get',
                  data: {},
                  success: function (result) {
                    let resultJson = JSON.parse(result);
                    $('#J_org_select').select2({
                      data: resultJson.object,
                      placeholder: '请选择',
                    }).val([reportData.reportOrgId]).trigger("change");
                  }
                });
              }

              //上报人
              $('.local-report-name').text(reportData.reportorName);

              //使用科室
              if (reportData.usedOfficeSelect) {
                if (reportData.usedOfficeSelect === '介入科导管室') {
                  $("input[name='office']").get(0).checked = true;
                }
                if (reportData.usedOfficeSelect === '影像科放射科') {
                  $("input[name='office']").get(1).checked = true;
                }
                if (reportData.usedOfficeSelect === '其他') {
                  $("input[name='office']").get(2).checked = true;

                }
                $('#J_office_other').val(reportData.usedOfficeOther);
              }
              //患者姓名
              if (reportData.patientName) {
                $('#J_name').val(reportData.patientName);
              }
              //性别
              if (!isNull(reportData.patientSex)) {
                if (reportData.patientSex === 1) {
                  $("input[name='sex']").get(0).checked = true;

                }
                if (reportData.patientSex === 0) {
                  $("input[name='sex']").get(1).checked = true;

                }
              }
              //年龄
              if (!isNull(reportData.patientAgeSelect)) {
                if (reportData.patientAgeSelect === '年龄') {
                  $("input[name='old']").get(0).checked = true;
                  $('#J_office_old').val(reportData.patientAgeY);
                  $('#J_office_old_select').val(reportData.patientAgeU);
                }
                if (reportData.patientAgeSelect === '出生日期') {
                  $("input[name='old']").get(1).checked = true;
                  $('#J_office_birthday').val(reportData.patientAgeB);
                }
              }
              //住院号
              if (!isNull(reportData.checkInNumber)) {
                $('#J_hospital_number').val(reportData.checkInNumber);
              }
              //临床诊断
              if (!isNull(reportData.diagnosis)) {
                $('#J_hospital_judge').val(reportData.diagnosis);
              }
              //手术名称
              if (!isNull(reportData.operationName)) {
                $('#J_operation_name').val(reportData.operationName);
              }
              //器械名称
              if (!isNull(reportData.equipmentId)) {
                $('#J_equipment_select').val([reportData.equipmentId]).trigger("change");
              }
              //曝光量
              if (!isNull(reportData.equipmentExposure)) {
                $('#J_exposure').val(reportData.equipmentExposure);
              }
              //连续工作时间
              if (!isNull(reportData.equipmentDuration)) {
                $('#J_work_time').val(reportData.equipmentDuration);
              }
              //临床使用信息-开始时间
              if (!isNull(reportData.equipmentStartTime)) {
                $('#J_start_time').val(reportData.equipmentStartTime);
              }
              //临床使用信息-结束时间
              if (!isNull(reportData.equipmentEndTime)) {
                $('#J_end_time').val(reportData.equipmentEndTime);
              }
              //高压注射器-器械名称
              if (!isNull(reportData.injectorName)) {
                $('#J_squirt_equipment').val(reportData.injectorName);
              }
              //高压注射器-生产企业
              if (!isNull(reportData.injectorFactory)) {
                $('#J_squirt_factory').val(reportData.injectorFactory);
              }
              //高压注射器-规格型号
              if (!isNull(reportData.injectorSpec)) {
                $('#J_squirt_spec').val(reportData.injectorSpec);
              }
              //高压注射器-使用方法
              if (!isNull(reportData.injectorHowUse)) {
                $('#J_squirt_method').val(reportData.injectorHowUse);
              }
              //高压注射器-开始时间
              if (!isNull(reportData.injectorStartTime)) {
                $('#J_squirt_start_time').val(reportData.injectorStartTime);
              }
              //高压注射器-结束时间
              if (!isNull(reportData.injectorEndTime)) {
                $('#J_squirt_end_time').val(reportData.injectorEndTime);
              }
              //造影机操作台
              if (!isNull(reportData.accidentDesktopSelect)) {
                if (reportData.accidentDesktopSelect === '无法启动') {
                  $("input[name='badDesk']").get(0).checked = true;
                }
                if (reportData.accidentDesktopSelect === '跳闸自动关机') {
                  $("input[name='badDesk']").get(1).checked = true;
                }
                if (reportData.accidentDesktopSelect === '高温报警') {
                  $("input[name='badDesk']").get(2).checked = true;
                }
                if (reportData.accidentDesktopSelect === '启动后无法工作') {
                  $("input[name='badDesk']").get(3).checked = true;
                }
                if (reportData.accidentDesktopSelect === '其他') {
                  $("input[name='badDesk']").get(4).checked = true;
                  $('#J_bad_desk_other').val(reportData.accidentDesktopOther);
                }
              }

              //C型臂球管等
              if (!isNull(reportData.accidentCSelect)) {
                if (reportData.accidentCSelect === '无法移动旋转') {
                  $("input[name='badC']").get(0).checked = true;
                }
                if (reportData.accidentCSelect === '球管过热') {
                  $("input[name='badC']").get(1).checked = true;
                }
                if (reportData.accidentCSelect === '球管出现打火现象') {
                  $("input[name='badC']").get(2).checked = true;
                }
                if (reportData.accidentCSelect === '无射线不曝光') {
                  $("input[name='badC']").get(3).checked = true;
                }
                if (reportData.accidentCSelect === '光圈异常') {
                  $("input[name='badC']").get(4).checked = true;
                }
                if (reportData.accidentCSelect === '其他') {
                  $("input[name='badC']").get(5).checked = true;
                  $('#J_bad_c_other').val(reportData.accidentCOther);
                }
              }

              //图像情况
              if (!isNull(reportData.accidentImgSelect)) {
                if (reportData.accidentImgSelect === '图像不能保存') {
                  $("input[name='badImage']").get(0).checked = true;
                }
                if (reportData.accidentImgSelect === '有射线无图像') {
                  $("input[name='badImage']").get(1).checked = true;
                }
                if (reportData.accidentImgSelect === '出现伪影') {
                  $("input[name='badImage']").get(2).checked = true;
                }
                if (reportData.accidentImgSelect === '出现残影') {
                  $("input[name='badImage']").get(3).checked = true;
                }
                if (reportData.accidentImgSelect === '出现亮线') {
                  $("input[name='badImage']").get(4).checked = true;
                }
                if (reportData.accidentImgSelect === '图像模糊难以辨识') {
                  $("input[name='badImage']").get(5).checked = true;
                }
                if (reportData.accidentImgSelect === '其他') {
                  $("input[name='badImage']").get(6).checked = true;
                  $('#J_bad_image_other').val(reportData.accidentImgOther);
                }
              }

              //手术床
              if (!isNull(reportData.accidentBedSelect)) {
                if (reportData.accidentBedSelect === '床面断电') {
                  $("input[name='badBed']").get(0).checked = true;
                }
                if (reportData.accidentBedSelect === '无法移动') {
                  $("input[name='badBed']").get(1).checked = true;
                }
                if (reportData.accidentBedSelect === '不能锁定') {
                  $("input[name='badBed']").get(2).checked = true;
                }
                if (reportData.accidentBedSelect === '突然解锁移动') {
                  $("input[name='badBed']").get(3).checked = true;
                }
                if (reportData.accidentBedSelect === '输液架无法固定') {
                  $("input[name='badBed']").get(4).checked = true;
                }
              }

              //图像情况
              if (!isNull(reportData.accidentPartSelect)) {
                if (reportData.accidentPartSelect === '防护铅板脱落') {
                  $("input[name='badPart']").get(0).checked = true;
                }
                if (reportData.accidentPartSelect === 'C型臂脱落') {
                  $("input[name='badPart']").get(1).checked = true;
                }
                if (reportData.accidentPartSelect === '其他') {
                  $("input[name='badPart']").get(2).checked = true;
                  $('#J_bad_part_other').val(reportData.accidentPartOther);
                }
              }

              //辐射
              if (!isNull(reportData.accident6Select)) {
                if (reportData.accident6Select === '医患出现明显的射线灼伤或其他辐射过量症状') {
                  $("input[name='badRadiate']").get(0).checked = true;
                }
                if (reportData.accident6Select === '其他') {
                  $("input[name='badRadiate']").get(1).checked = true;
                  $('#J_bad_radiate_other').val(reportData.accident6Other);
                }
              }

              //卷入异物
              if (!isNull(reportData.accident7Select)) {
                if (reportData.accident7Select === '机器卷入异物无法正常运转') {
                  $("input[name='badMatter']").get(0).checked = true;
                }
                if (reportData.accident7Select === '其他') {
                  $("input[name='badMatter']").get(1).checked = true;
                  $('#J_bad_matter_other').val(reportData.accident7Other);
                }
              }

            }
          },
          error: function (error) {
            $('#J_network_modal').modal('show');
          }
        });
      }

      if (!isNull(accidentId)) {

        //获取不良事件报告表数据
        $.ajax({
          url: window.localStorage.backSystemUrl + '/query/DSA/harm/report/by/accidentId',
          headers: {
            Authorization: "Bearer " + window.localStorage.myTokenKey
          },
          method: 'get',
          data: {accidentId: accidentId},
          success: function (result) {
            let resultJson = JSON.parse(result);
            if (resultJson.successful && resultJson.object) {
              var reportData = resultJson.object;

              //不良事件发生时间
              if (!isNull(reportData.harmHappenTimeSelect)) {
                if (reportData.harmHappenTimeSelect === '临床使用期间') {
                  $("input[name='harmTime']").get(0).checked = true;
                }
                if (reportData.harmHappenTimeSelect === '设备日常维护检测期间') {
                  $("input[name='harmTime']").get(1).checked = true;
                }
              }

              //不良事件过程描述-是否涉及造影机故障
              if (!isNull(reportData.harmCourseSelect)) {
                if (reportData.harmCourseSelect === '是') {
                  $("input[name='harmMachineSelf']").get(0).checked = true;
                }
                if (reportData.harmCourseSelect === '否') {
                  $("input[name='harmMachineSelf']").get(1).checked = true;
                }
              }

              //不良事件过程描述-过程描述文字信息
              if (!isNull(reportData.harmCourseDescription)) {
                $(".harm-status-description").val(reportData.harmCourseDescription);
              }

              //不良事件处理情况
              if (!isNull(reportData.harmProcessSelect)) {
                if (reportData.harmProcessSelect === '不需处理自动恢复') {
                  $("input[name='harmOperate']").get(0).checked = true;
                }
                if (reportData.harmProcessSelect === '重启设备后恢复') {
                  $("input[name='harmOperate']").get(1).checked = true;
                }
                if (reportData.harmProcessSelect === '更换设备短时暂停') {
                  $("input[name='harmOperate']").get(2).checked = true;
                  $('#J_harm_operate_during').val(reportData.harmProcessStopDuring);
                }
                if (reportData.harmProcessSelect === '手术中止维修设备') {
                  $("input[name='harmOperate']").get(3).checked = true;
                }
              }
              //不良事件处理情况-描述文字
              if (!isNull(reportData.harmProcessDescription)) {
                $("#J_harm_operate_description").val(reportData.harmProcessDescription);
              }
              //事件发生初步原因分析
              if (!isNull(reportData.harmReasonText)) {
                $(".harm-reason-description").val(reportData.harmReasonText);
              }
              //设备维修后的情况
              if (!isNull(reportData.harmEquipmentRepair)) {
                $(".harm-repair-description").val(reportData.harmEquipmentRepair);
              }
              //不良事件严重程度
              if (!isNull(reportData.harmLevelSelect)) {
                if (reportData.harmLevelSelect === '对患者无影响') {
                  $("input[name='harmSerious']").get(0).checked = true;
                }
                if (reportData.harmLevelSelect === '一般') {
                  $("input[name='harmSerious']").get(1).checked = true;
                }
                if (reportData.harmLevelSelect === '严重') {
                  $("input[name='harmSerious']").get(2).checked = true;
                  if (!isNull(reportData.harmTerribleLevelSelect)) {
                    if (reportData.harmTerribleLevelSelect === '死亡') {
                      $("input[name='harmSeriousDetail']").get(0).checked = true;
                    }
                    if (reportData.harmTerribleLevelSelect === '危及生命') {
                      $("input[name='harmSeriousDetail']").get(1).checked = true;
                    }
                    if (reportData.harmTerribleLevelSelect === '机体功能机构永久性损伤') {
                      $("input[name='harmSeriousDetail']").get(2).checked = true;
                    }
                    if (reportData.harmTerribleLevelSelect === '需要内外科治疗避免上述永久损伤') {
                      $("input[name='harmSeriousDetail']").get(3).checked = true;
                    }
                  }
                }
              }
              //不良事件后果
              if (!isNull(reportData.harmResultSelect)) {
                if (reportData.harmResultSelect === '痊愈') {
                  $("input[name='harmResult']").get(0).checked = true;
                  $('#J_harm_gout_time').val(reportData.harmResultRecoveryTime);
                }
                if (reportData.harmResultSelect === '有后遗症') {
                  $("input[name='harmResult']").get(1).checked = true;
                  $('#J_harm_sequel').val(reportData.harmResultSequela);
                }
                if (reportData.harmResultSelect === '死亡') {
                  $("input[name='harmResult']").get(2).checked = true;
                  $('#J_harm_died_time').val(reportData.harmResultDiedTime);
                  $('#J_harm_died_reason').val(reportData.harmResultDiedReason);
                }
              }
              //对原患疾病的影响
              if (!isNull(reportData.harmOriginalSelect)) {
                if (reportData.harmOriginalSelect === '不明显') {
                  $("input[name='harmOriginal']").get(0).checked = true;
                }
                if (reportData.harmOriginalSelect === '病程延长') {
                  $("input[name='harmOriginal']").get(1).checked = true;
                }
                if (reportData.harmOriginalSelect === '病情加重') {
                  $("input[name='harmOriginal']").get(2).checked = true;
                }
                if (reportData.harmOriginalSelect === '导致后遗症') {
                  $("input[name='harmOriginal']").get(3).checked = true;
                  $('#J_original_sequel').val(reportData.harmOriginalSequela);
                }
                if (reportData.harmOriginalSelect === '导致死亡') {
                  $("input[name='harmOriginal']").get(4).checked = true;
                  $('#J_original_died_time').val(reportData.harmOriginalDiedTime);
                }
              }
              //不良事件关联性评价1
              if (!isNull(reportData.harmSelfRelativeEvaluate1)) {
                if (reportData.harmSelfRelativeEvaluate1 === '是') {
                  $("input[name='harmRelation1']").get(0).checked = true;
                }
                if (reportData.harmSelfRelativeEvaluate1 === '否') {
                  $("input[name='harmRelation1']").get(1).checked = true;
                }
              }
              //不良事件关联性评价2
              if (!isNull(reportData.harmSelfRelativeEvaluate2)) {
                if (reportData.harmSelfRelativeEvaluate2 === '是') {
                  $("input[name='harmRelation2']").get(0).checked = true;
                }
                if (reportData.harmSelfRelativeEvaluate2 === '否') {
                  $("input[name='harmRelation2']").get(1).checked = true;
                }
                if (reportData.harmSelfRelativeEvaluate2 === '无法确定') {
                  $("input[name='harmRelation2']").get(2).checked = true;
                }
              }
              //不良事件关联性评价3
              if (!isNull(reportData.harmSelfRelativeEvaluate3)) {
                if (reportData.harmSelfRelativeEvaluate3 === '是') {
                  $("input[name='harmRelation3']").get(0).checked = true;
                }
                if (reportData.harmSelfRelativeEvaluate3 === '否') {
                  $("input[name='harmRelation3']").get(1).checked = true;
                }
                if (reportData.harmSelfRelativeEvaluate3 === '无法确定') {
                  $("input[name='harmRelation3']").get(2).checked = true;
                }
              }
              //与数字减影血管造影机的因果关系评价
              if (!isNull(reportData.harmSelfRelativeResult)) {
                if (reportData.harmSelfRelativeResult === '很有可能') {
                  $("input[name='harmRelationResult']").get(0).checked = true;
                }
                if (reportData.harmSelfRelativeResult === '可能有关') {
                  $("input[name='harmRelationResult']").get(1).checked = true;
                }
                if (reportData.harmSelfRelativeResult === '可能无关') {
                  $("input[name='harmRelationResult']").get(2).checked = true;
                }
                if (reportData.harmSelfRelativeResult === '无法确定') {
                  $("input[name='harmRelationResult']").get(3).checked = true;
                }
              }

            }
          },
          error: function (error) {
            $('#J_network_modal').modal('show');
          }
        });


      }


    }

    function isNull(data) {
      return (data === "" || data === undefined || data === null) ? true : false;
    }

    //绑定点击事件
    bindClickAction();
    function bindClickAction() {
      //禁用TAB的点击事件
      $('.bad-tab-li,.observe-tab-li').css("pointer-events", "none");

      $('#J_continue_harm_fill').on('click', function () {
        $('a[href="#tab2"]').click();
        $(window).scrollTop(0);
        $('body').scrollTop(0);
        $('html').scrollTop(0);
      });

      $('#J_go_back_modify').on('click', function () {
        $('a[href="#tab1"]').click();
        $(window).scrollTop(0);
        $('body').scrollTop(0);
        $('html').scrollTop(0);
      });

      //监测观察表的暂存与提交
      $('.submit-observe').on('click', function () {
        $(this).css("pointer-events", "none");
        let isToTemp = $(this).hasClass('submit-temp-button'); //暂存还是提交
        submitORTemp(isToTemp);
      });

      //不良事件报告表的暂存与提交
      $('.submit-harm').on('click', function () {
        $(this).css("pointer-events", "none");
        let isToTemp = $(this).hasClass('submit-temp-harm'); //暂存还是提交
        submitORTemp(isToTemp);
      });

    }

    //获取表格变量值
    function getFillValue(isToTemp) {
      //监测表
      accidentId = $('input[name="AccidentReportId"]').val();  //数字减影不良事件观察表ID
      observeId = $('input[name="ObserveReportId"]').val(); //数字减影血管造影机监测观察表ID
      status = isToTemp ? '暂存' : '待评价'; //报告状态直接存中文：暂存、待评价、已评价、市级已退回、省级已退回
      hasAccident = $('input[name="isAccident"]').val();  //是否发生不良事件：N 否\nY 是
      equipmentId = $('#J_equipment_select').val(); //具体的机器ID   MEDIC_EQUIPMENT_DETAIL 表
      equipmentCategory = $('input[name="categoryName"]').val(); //机器类别，直接存中文：数字减影血管造影机......
      reportOrgId = $('#J_org_select').val();     //上报单位ID
      reportOrgName = $('#select2-J_org_select-container').text();    //上报单位名称：辽宁省-沈阳市 沈阳市第一医院
      flowLog = returnFlowLog(isToTemp, reportOrgName); // 审批流程日志JSON:  [{stepName:XXX市级中心审阅通过提交省级, stepDate:2017-09-13},{}]
      usedOfficeSelect = $("input[name='office']:checked").val(); //使用科室：直接存中文：介入科导管室、影像科放射科、其他
      usedOfficeOther = $('#J_office_other').val(); //使用科室-其他
      patientName = $('#J_name').val(); //患者姓名
      patientSex = $("input[name='sex']:checked").val(); //0 女\n1 男
      patientAgeSelect = $("input[name='old']:checked").val(); //患者年龄：直接存中文：年龄、出生日期
      patientAgeY = $('#J_office_old').val(); //年龄选项：23 不论年龄选项是否选择，这一项都要实时计算录入，数据统计会用到
      patientAgeU = $('#J_office_old_select').val(); //年龄单位：岁、月、周
      patientAgeB = $('#J_office_birthday').val(); //出生日期选项：2017年09月18
      if (patientAgeSelect === '出生日期') {
        patientAgeY = jsGetAge(patientAgeB.replace(/年/, "-").replace(/月/, "-").replace(/日/, ""));
        patientAgeU = "岁";
      }
      checkInNumber = $('#J_hospital_number').val(); //住院号
      diagnosis = $('#J_hospital_judge').val(); //临床诊断
      operationName = $('#J_operation_name').val(); //手术名称
      equipmentExposure = $('#J_exposure').val(); //曝光量
      equipmentDuration = $('#J_work_time').val();//使用时长
      equipmentStartTime = $('#J_start_time').val(); //开始时间
      equipmentEndTime = $('#J_end_time').val();//结束时间
      injectorName = $('#J_squirt_equipment').val(); //注射器设备名称
      injectorFactory = $('#J_squirt_factory').val(); //注射器生产企业
      injectorSpec = $('#J_squirt_spec').val();  //注射器规格型号
      injectorHowUse = $('#J_squirt_method').val(); //注射器使用方法
      injectorStartTime = $('#J_squirt_start_time').val(); //开始时间
      injectorEndTime = $('#J_squirt_end_time').val(); //结束时间
      accidentDesktopSelect = $("input[name='badDesk']:checked").val(); //造影机操作台：直接存中文：无法启动、跳闸自动关机、高温报警、启动后无法工作、其他
      accidentDesktopOther = $('#J_bad_desk_other').val(); //造影机操作台其他
      accidentCSelect = $("input[name='badC']:checked").val(); //C型臂球馆：直接存中文：无法移动旋转、球管过热、球管出现打火现象、无射线不曝光、光圈异常、其他
      accidentCOther = $('#J_bad_c_other').val(); //C型臂球馆其他
      accidentImgSelect = $("input[name='badImage']:checked").val(); //图像情况：直接存中文：图像不能保存、有射线无图像、出现伪影、出现亮线、图像模糊难以识别、其他
      accidentImgOther = $('#J_bad_image_other').val();  //图像情况其他
      accidentBedSelect = $("input[name='badBed']:checked").val(); //手术床：直接存中文：床面断电、无法移动、不能锁定、突然解锁移动、输液架无法固定
      accidentPartSelect = $("input[name='badPart']:checked").val();  //设备部件：直接存中文：防护铅板脱落、C型臂脱落、其他
      accidentPartOther = $('#J_bad_part_other').val(); //设备部件其他
      accident6Select = $("input[name='badRadiate']:checked").val(); //6：直接存中文：医患出现明显的射线灼伤，其他
      accident6Other = $('#J_bad_radiate_other').val();//6其他
      accident7Select = $("input[name='badMatter']:checked").val(); //7：直接存中文：机器卷入异物无法正常运转，其他
      accident7Other = $('#J_bad_matter_other').val();  //7其他

      //不论之前是填写的报告，只要提交，上报人就存储为当前的账号人，因为是当前账号人更改并提交的
      reportorId = window.localStorage.userIdKey; //报告人ID
      reportorName = window.localStorage.fullNameKey; // 报告人姓名

      //不良时间报告表
      harmHappenTimeSelect = $("input[name='harmTime']:checked").val();//不良事件发生时间，直接存中文：临床使用期间、设备日常维护监测期间
      harmCourseSelect = $("input[name='harmMachineSelf']:checked").val();//不良事件过程描述-是否涉及造影机故障：直接存中文：是、否
      harmCourseDescription = $('.harm-status-description').val(); //不良事件过程描述文本
      harmProcessSelect = $("input[name='harmOperate']:checked").val();//不良事件处理情况radio：直接存中文：不需处理自动恢复、重启设备后恢复、更换设备后短时暂停、手术中止维修设备
      harmProcessStopDuring = $('#J_harm_operate_during').val();//不良事件处理情况中的短时暂停时间
      harmProcessDescription = $('#J_harm_operate_description').val(); //不良时间处理情况-处理措施具体描述
      harmReasonText = $('.harm-reason-description').val();//事件发生初步原因分析
      harmEquipmentRepair = $('.harm-repair-description').val();//设备维修后的情况
      harmLevelSelect = $("input[name='harmSerious']:checked").val();//不良事件严重程度radio：直接存中文：对患者无影响、一般、严重',
      harmTerribleLevelSelect = $("input[name='harmSeriousDetail']:checked").val(); //不良事件严重程度-如果是严重：直接存中文：死亡、危及生命、机体功能结构永久性损伤、需要内外科治疗避免上述永久性损伤',
      harmResultSelect = $("input[name='harmResult']:checked").val();//不良事件的结果：痊愈、有后遗症、死亡',
      harmResultRecoveryTime = $('#J_harm_gout_time').val();//不良事件的结果-转归时间',
      harmResultSequela = $('#J_harm_sequel').val();//不良事件的结果-后遗症表现',
      harmResultDiedTime = $('#J_harm_died_time').val();//不良事件的结果-死亡时间',
      harmResultDiedReason = $('#J_harm_died_reason').val();//不良事件的结果-直接死因',
      harmOriginalSelect = $("input[name='harmOriginal']:checked").val();//对原患疾病的影响：直接存中文：不明显、病程延长、病情加重、导致后遗症、导致死亡',
      harmOriginalSequela = $('#J_original_sequel').val();//对原患疾病的影响-后遗症表现',
      harmOriginalDiedTime = $('#J_original_died_time').val();//对原患疾病的影响-死亡时间',
      harmSelfRelativeEvaluate1 = $("input[name='harmRelation1']:checked").val();//不良事件关联性评价-自评-第一项-直接存中文：是、否',
      harmSelfRelativeEvaluate2 = $("input[name='harmRelation2']:checked").val();//不良事件关联性评价-自评-第二项-直接存中文：是、否',
      harmSelfRelativeEvaluate3 = $("input[name='harmRelation3']:checked").val();//不良事件关联性评价-自评-第三项-直接存中文：是、否',
      harmSelfRelativeResult = $("input[name='harmRelationResult']:checked").val();//自评-与数字减影血管造影机的因果关系评价-直接存中文：很有可能、可能有关、可能无关、无法确定',
    }


    //监测观察表的暂存与提交
    function submitORTemp(isToTemp) {
      getFillValue(isToTemp);
      //监测表的暂存或提交
      $.ajax({
        url: window.localStorage.backSystemUrl + '/submit/DSA/report',
        headers: {
          Authorization: "Bearer " + window.localStorage.myTokenKey
        },
        method: 'post',
        data: {
          accidentId: accidentId,
          observeId: observeId,
          status: status,
          hasAccident: hasAccident,
          equipmentId: equipmentId,
          equipmentCategory: equipmentCategory,
          reportOrgId: reportOrgId,
          reportOrgName: reportOrgName,
          flowLog: flowLog,
          evaluateBrief: evaluateBrief,
          usedOfficeSelect: usedOfficeSelect,
          usedOfficeOther: usedOfficeOther,
          patientName: patientName,
          patientSex: patientSex,
          patientAgeSelect: patientAgeSelect,
          patientAgeY: patientAgeY,
          patientAgeU: patientAgeU,
          patientAgeB: patientAgeB,
          checkInNumber: checkInNumber,
          diagnosis: diagnosis,
          operationName: operationName,
          equipmentExposure: equipmentExposure,
          equipmentDuration: equipmentDuration,
          equipmentStartTime: equipmentStartTime,
          equipmentEndTime: equipmentEndTime,
          injectorName: injectorName,
          injectorFactory: injectorFactory,
          injectorSpec: injectorSpec,
          injectorHowUse: injectorHowUse,
          injectorStartTime: injectorStartTime,
          injectorEndTime: injectorEndTime,
          accidentDesktopSelect: accidentDesktopSelect,
          accidentDesktopOther: accidentDesktopOther,
          accidentCSelect: accidentCSelect,
          accidentCOther: accidentCOther,
          accidentImgSelect: accidentImgSelect,
          accidentImgOther: accidentImgOther,
          accidentBedSelect: accidentBedSelect,
          accidentPartSelect: accidentPartSelect,
          accidentPartOther: accidentPartOther,
          accident6Select: accident6Select,
          accident6Other: accident6Other,
          accident7Select: accident7Select,
          accident7Other: accident7Other,
          reportorId: reportorId,
          reportorName: reportorName,

          harmHappenTimeSelect: harmHappenTimeSelect,
          harmCourseSelect: harmCourseSelect,
          harmCourseDescription: harmCourseDescription,
          harmProcessSelect: harmProcessSelect,
          harmProcessStopDuring: harmProcessStopDuring,
          harmProcessDescription: harmProcessDescription,
          harmReasonText: harmReasonText,
          harmEquipmentRepair: harmEquipmentRepair,
          harmLevelSelect: harmLevelSelect,
          harmTerribleLevelSelect: harmTerribleLevelSelect,
          harmResultSelect: harmResultSelect,
          harmResultRecoveryTime: harmResultRecoveryTime,
          harmResultSequela: harmResultSequela,
          harmResultDiedTime: harmResultDiedTime,
          harmResultDiedReason: harmResultDiedReason,
          harmOriginalSelect: harmOriginalSelect,
          harmOriginalSequela: harmOriginalSequela,
          harmOriginalDiedTime: harmOriginalDiedTime,
          harmSelfRelativeEvaluate1: harmSelfRelativeEvaluate1,
          harmSelfRelativeEvaluate2: harmSelfRelativeEvaluate2,
          harmSelfRelativeEvaluate3: harmSelfRelativeEvaluate3,
          harmSelfRelativeResult: harmSelfRelativeResult
        },
        success: function (result) {
          let resultJson = JSON.parse(result);
          if (resultJson.successful && resultJson.object) {
            $('input[name="ObserveReportId"]').val(resultJson.object.observeId); //回调记录观察表ID
            $('input[name="AccidentReportId"]').val(resultJson.object.accidentId); //回调记录不良事件表ID
            if (isToTemp) {
              toastr.options.positionClass = 'toast-bottom-right';
              toastr.success("暂存成功!");
            } else {
              window.open('/report/submit/report/success/result?observeId=' + resultJson.object.observeId, '_self');
            }
          } else {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error("提交失败！请稍后重试！");
          }
          $('.submit-observe').css("pointer-events", "auto");
          $('.submit-harm').css("pointer-events", "auto");
        },
        error: function (error) {
          $('#J_network_modal').modal('show');
          $('.submit-observe').css("pointer-events", "auto");
          $('.submit-harm').css("pointer-events", "auto");
        }
      });
    }

    //{stepName:XXX市级中心审阅通过提交省级, stepDate:2017-09-13}
    function returnFlowLog(isToTemp, reportOrgName) {
      //计算当前时间
      let date = new Date();
      let seperator1 = "-";
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
      var log = {stepName: reportOrgName.split(/[ ]+/)[1] + '提交报告', stepDate: currentdate};

      return isToTemp ? '' : JSON.stringify(log);
    }

    //根据出生日期算出年龄
    function jsGetAge(strBirthday) {
      var returnAge;
      var strBirthdayArr = strBirthday.split("-");
      var birthYear = strBirthdayArr[0];
      var birthMonth = strBirthdayArr[1];
      var birthDay = strBirthdayArr[2];

      d = new Date();
      var nowYear = d.getFullYear();
      var nowMonth = d.getMonth() + 1;
      var nowDay = d.getDate();

      if (nowYear == birthYear) {
        returnAge = 0;//同年 则为0岁
      }
      else {
        var ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
          if (nowMonth == birthMonth) {
            var dayDiff = nowDay - birthDay;//日之差
            if (dayDiff < 0) {
              returnAge = ageDiff - 1;
            }
            else {
              returnAge = ageDiff;
            }
          }
          else {
            var monthDiff = nowMonth - birthMonth;//月之差
            if (monthDiff < 0) {
              returnAge = ageDiff - 1;
            }
            else {
              returnAge = ageDiff;
            }
          }
        }
        else {
          returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
      }

      return returnAge;//返回周岁年龄

    }
  })(jQuery);
});

},{}]},{},[1]);
