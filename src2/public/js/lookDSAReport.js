/**
 * Created by roper on 2017/9/11.
 */
var $ = require("jquery");
var XTemplate = require('xtemplate');
var deleteModalTemplate = new XTemplate($('#J_delete_one_template').html());


$(document).ready(function () {
  (function ($) {

    //全局变量-监测表
    let accidentId;  //数字减影不良事件观察表ID
    let observeId; //数字减影血管造影机监测观察表ID
    let status; //报告状态直接存中文：暂存、待评价、已评价、市级已退回、省级已退回

    let openType = $('input[name="openType"]').val(); //look-查看 review-评价

    //禁用所有radio
    $('input[type="radio"]').attr("disabled", true);
    //如果是评审，则不禁用评价部分的radio按钮
    if (openType === 'review') {
      $("input[name='harmRelationEvaluation1'][value='是']").attr("disabled", false);
      $("input[name='harmRelationEvaluation1'][value='否']").attr("disabled", false);

      $("input[name='harmRelationEvaluation2'][value='是']").attr("disabled", false);
      $("input[name='harmRelationEvaluation2'][value='否']").attr("disabled", false);
      $("input[name='harmRelationEvaluation2'][value='无法确定']").attr("disabled", false);

      $("input[name='harmRelationEvaluation3'][value='是']").attr("disabled", false);
      $("input[name='harmRelationEvaluation3'][value='否']").attr("disabled", false);
      $("input[name='harmRelationEvaluation3'][value='无法确定']").attr("disabled", false);

      $("input[name='harmRelationEvaluationResult'][value='可能有关']").attr("disabled", false);
      $("input[name='harmRelationEvaluationResult'][value='可能无关']").attr("disabled", false);
      $("input[name='harmRelationEvaluationResult'][value='无法确定']").attr("disabled", false);

      $("input[name='harmRelationEvaluationBad'][value='是']").attr("disabled", false);
      $("input[name='harmRelationEvaluationBad'][value='否']").attr("disabled", false);
      $("input[name='harmRelationEvaluationBad'][value='无法确定']").attr("disabled", false);

      $("input[name='harmRelationEvaluationAd'][value='不符合报告标准']").attr("disabled", false);
      $("input[name='harmRelationEvaluationAd'][value='继续监测']").attr("disabled", false);
      $("input[name='harmRelationEvaluationAd'][value='进一步处理']").attr("disabled", false);

    }


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

      $('#J_org_select').select2().prop("disabled", true);//禁用
      $('#J_equipment_select').select2().prop("disabled", true);//禁用

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

    //将原来的报告数据填写回去
    initAlreadyVar();
    function initAlreadyVar() {
      var observeId = $('input[name="ObserveReportId"]').val();
      var accidentId = $('input[name="AccidentReportId"]').val();

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
            //如果是查看的话，则填写评价数据
            if (openType === 'look') {
              $('.evaluate-textarea').val(reportData.evaluateBrief);
              //初始化参评人
              $('.reporter-name').text(isNull(reportData.reportorName) ? '待评价' : reportData.reportorName);

            } else {
              //初始化参评人
              $('.reporter-name').text(window.localStorage.fullNameKey);
            }

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
            //使用科室
            if (reportData.usedOfficeSelect) {
              if (reportData.usedOfficeSelect === '介入科导管室') {
                $("input[name='office']").get(0).checked = true;
                $("input[name='office'][value='介入科导管室']").attr("disabled", false);
              }
              if (reportData.usedOfficeSelect === '影像科放射科') {
                $("input[name='office']").get(1).checked = true;
                $("input[name='office'][value='影像科放射科']").attr("disabled", false);
              }
              if (reportData.usedOfficeSelect === '其他') {
                $("input[name='office']").get(2).checked = true;
                $("input[name='office'][value='其他']").attr("disabled", false);
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
                $("input[name='sex'][value='1']").attr("disabled", false);

              }
              if (reportData.patientSex === 0) {
                $("input[name='sex']").get(1).checked = true;
                $("input[name='sex'][value='0']").attr("disabled", false);

              }
            }
            //年龄
            if (!isNull(reportData.patientAgeSelect)) {
              if (reportData.patientAgeSelect === '年龄') {
                $("input[name='old']").get(0).checked = true;
                $("input[name='old'][value='年龄']").attr("disabled", false);
                $('#J_office_old').val(reportData.patientAgeY);
                $('#J_office_old_select').val(reportData.patientAgeU);
              }
              if (reportData.patientAgeSelect === '出生日期') {
                $("input[name='old']").get(1).checked = true;
                $("input[name='old'][value='出生日期']").attr("disabled", false);
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
                $("input[name='badDesk'][value='无法启动']").attr("disabled", false);
              }
              if (reportData.accidentDesktopSelect === '跳闸自动关机') {
                $("input[name='badDesk']").get(1).checked = true;
                $("input[name='badDesk'][value='跳闸自动关机']").attr("disabled", false);
              }
              if (reportData.accidentDesktopSelect === '高温报警') {
                $("input[name='badDesk']").get(2).checked = true;
                $("input[name='badDesk'][value='高温报警']").attr("disabled", false);
              }
              if (reportData.accidentDesktopSelect === '启动后无法工作') {
                $("input[name='badDesk']").get(3).checked = true;
                $("input[name='badDesk'][value='启动后无法工作']").attr("disabled", false);
              }
              if (reportData.accidentDesktopSelect === '其他') {
                $("input[name='badDesk']").get(4).checked = true;
                $("input[name='badDesk'][value='其他']").attr("disabled", false);
                $('#J_bad_desk_other').val(reportData.accidentDesktopOther);
              }
            }

            //C型臂球管等
            if (!isNull(reportData.accidentCSelect)) {
              if (reportData.accidentCSelect === '无法移动旋转') {
                $("input[name='badC']").get(0).checked = true;
                $("input[name='badC'][value='无法移动旋转']").attr("disabled", false);
              }
              if (reportData.accidentCSelect === '球管过热') {
                $("input[name='badC']").get(1).checked = true;
                $("input[name='badC'][value='球管过热']").attr("disabled", false);
              }
              if (reportData.accidentCSelect === '球管出现打火现象') {
                $("input[name='badC']").get(2).checked = true;
                $("input[name='badC'][value='球管出现打火现象']").attr("disabled", false);
              }
              if (reportData.accidentCSelect === '无射线不曝光') {
                $("input[name='badC']").get(3).checked = true;
                $("input[name='badC'][value='无射线不曝光']").attr("disabled", false);
              }
              if (reportData.accidentCSelect === '光圈异常') {
                $("input[name='badC']").get(4).checked = true;
                $("input[name='badC'][value='光圈异常']").attr("disabled", false);
              }
              if (reportData.accidentCSelect === '其他') {
                $("input[name='badC']").get(5).checked = true;
                $("input[name='badC'][value='其他']").attr("disabled", false);
                $('#J_bad_c_other').val(reportData.accidentCOther);
              }
            }

            //图像情况
            if (!isNull(reportData.accidentImgSelect)) {
              if (reportData.accidentImgSelect === '图像不能保存') {
                $("input[name='badImage']").get(0).checked = true;
                $("input[name='badImage'][value='图像不能保存']").attr("disabled", false);
              }
              if (reportData.accidentImgSelect === '有射线无图像') {
                $("input[name='badImage']").get(1).checked = true;
                $("input[name='badImage'][value='有射线无图像']").attr("disabled", false);
              }
              if (reportData.accidentImgSelect === '出现伪影') {
                $("input[name='badImage']").get(2).checked = true;
                $("input[name='badImage'][value='出现伪影']").attr("disabled", false);
              }
              if (reportData.accidentImgSelect === '出现残影') {
                $("input[name='badImage']").get(3).checked = true;
                $("input[name='badImage'][value='出现残影']").attr("disabled", false);
              }
              if (reportData.accidentImgSelect === '出现亮线') {
                $("input[name='badImage']").get(4).checked = true;
                $("input[name='badImage'][value='出现亮线']").attr("disabled", false);
              }
              if (reportData.accidentImgSelect === '图像模糊难以辨识') {
                $("input[name='badImage']").get(5).checked = true;
                $("input[name='badImage'][value='图像模糊难以辨识']").attr("disabled", false);
              }
              if (reportData.accidentImgSelect === '其他') {
                $("input[name='badImage']").get(6).checked = true;
                $("input[name='badImage'][value='其他']").attr("disabled", false);
                $('#J_bad_image_other').val(reportData.accidentImgOther);
              }
            }

            //手术床
            if (!isNull(reportData.accidentBedSelect)) {
              if (reportData.accidentBedSelect === '床面断电') {
                $("input[name='badBed']").get(0).checked = true;
                $("input[name='badBed'][value='床面断电']").attr("disabled", false);
              }
              if (reportData.accidentBedSelect === '无法移动') {
                $("input[name='badBed']").get(1).checked = true;
                $("input[name='badBed'][value='无法移动']").attr("disabled", false);
              }
              if (reportData.accidentBedSelect === '不能锁定') {
                $("input[name='badBed']").get(2).checked = true;
                $("input[name='badBed'][value='不能锁定']").attr("disabled", false);
              }
              if (reportData.accidentBedSelect === '突然解锁移动') {
                $("input[name='badBed']").get(3).checked = true;
                $("input[name='badBed'][value='突然解锁移动']").attr("disabled", false);
              }
              if (reportData.accidentBedSelect === '输液架无法固定') {
                $("input[name='badBed']").get(4).checked = true;
                $("input[name='badBed'][value='输液架无法固定']").attr("disabled", false);
              }
            }

            //图像情况
            if (!isNull(reportData.accidentPartSelect)) {
              if (reportData.accidentPartSelect === '防护铅板脱落') {
                $("input[name='badPart']").get(0).checked = true;
                $("input[name='badPart'][value='防护铅板脱落']").attr("disabled", false);
              }
              if (reportData.accidentPartSelect === 'C型臂脱落') {
                $("input[name='badPart']").get(1).checked = true;
                $("input[name='badPart'][value='C型臂脱落']").attr("disabled", false);
              }
              if (reportData.accidentPartSelect === '其他') {
                $("input[name='badPart']").get(2).checked = true;
                $("input[name='badPart'][value='其他']").attr("disabled", false);
                $('#J_bad_part_other').val(reportData.accidentPartOther);
              }
            }

            //辐射
            if (!isNull(reportData.accident6Select)) {
              if (reportData.accident6Select === '医患出现明显的射线灼伤或其他辐射过量症状') {
                $("input[name='badRadiate']").get(0).checked = true;
                $("input[name='badRadiate'][value='医患出现明显的射线灼伤或其他辐射过量症状']").attr("disabled", false);
              }
              if (reportData.accident6Select === '其他') {
                $("input[name='badRadiate']").get(1).checked = true;
                $("input[name='badRadiate'][value='其他']").attr("disabled", false);
                $('#J_bad_radiate_other').val(reportData.accident6Other);
              }
            }

            //卷入异物
            if (!isNull(reportData.accident7Select)) {
              if (reportData.accident7Select === '机器卷入异物无法正常运转') {
                $("input[name='badMatter']").get(0).checked = true;
                $("input[name='badMatter'][value='机器卷入异物无法正常运转']").attr("disabled", false);
              }
              if (reportData.accident7Select === '其他') {
                $("input[name='badMatter']").get(1).checked = true;
                $("input[name='badMatter'][value='其他']").attr("disabled", false);
                $('#J_bad_matter_other').val(reportData.accident7Other);
              }
            }

          }
        },
        error: function (error) {
          $('#J_network_modal').modal('show');
        }
      });


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

              //如果是查看的话，则填写评价数据
              if (openType === 'look') {
                if (reportData.superiorRelativeEvaluate1 === '是') {
                  $("input[name='harmRelationEvaluation1']").get(0).checked = true;
                  $("input[name='harmRelationEvaluation1'][value='是']").attr("disabled", false);
                }
                if (reportData.superiorRelativeEvaluate1 === '否') {
                  $("input[name='harmRelationEvaluation1']").get(1).checked = true;
                  $("input[name='harmRelationEvaluation1'][value='否']").attr("disabled", false);
                }


                if (reportData.superiorRelativeEvaluate2 === '是') {
                  $("input[name='harmRelationEvaluation2']").get(0).checked = true;
                  $("input[name='harmRelationEvaluation2'][value='是']").attr("disabled", false);
                }
                if (reportData.superiorRelativeEvaluate2 === '否') {
                  $("input[name='harmRelationEvaluation2']").get(1).checked = true;
                  $("input[name='harmRelationEvaluation2'][value='否']").attr("disabled", false);
                }
                if (reportData.superiorRelativeEvaluate2 === '无法确定') {
                  $("input[name='harmRelationEvaluation2']").get(2).checked = true;
                  $("input[name='harmRelationEvaluation2'][value='无法确定']").attr("disabled", false);
                }


                if (reportData.superiorRelativeEvaluate3 === '是') {
                  $("input[name='harmRelationEvaluation3']").get(0).checked = true;
                  $("input[name='harmRelationEvaluation3'][value='是']").attr("disabled", false);
                }
                if (reportData.superiorRelativeEvaluate3 === '否') {
                  $("input[name='harmRelationEvaluation3']").get(1).checked = true;
                  $("input[name='harmRelationEvaluation3'][value='否']").attr("disabled", false);
                }
                if (reportData.superiorRelativeEvaluate3 === '无法确定') {
                  $("input[name='harmRelationEvaluation3']").get(2).checked = true;
                  $("input[name='harmRelationEvaluation3'][value='无法确定']").attr("disabled", false);
                }


                if (reportData.superiorRelativeResult === '可能有关') {
                  $("input[name='harmRelationEvaluationResult']").get(0).checked = true;
                  $("input[name='harmRelationEvaluationResult'][value='可能有关']").attr("disabled", false);
                }
                if (reportData.superiorRelativeResult === '可能无关') {
                  $("input[name='harmRelationEvaluationResult']").get(1).checked = true;
                  $("input[name='harmRelationEvaluationResult'][value='可能无关']").attr("disabled", false);
                }
                if (reportData.superiorRelativeResult === '无法确定') {
                  $("input[name='harmRelationEvaluationResult']").get(2).checked = true;
                  $("input[name='harmRelationEvaluationResult'][value='无法确定']").attr("disabled", false);
                }


                if (reportData.technologyIsHarmSituation === '是') {
                  $("input[name='harmRelationEvaluationBad']").get(0).checked = true;
                  $("input[name='harmRelationEvaluationBad'][value='是']").attr("disabled", false);
                }
                if (reportData.technologyIsHarmSituation === '否') {
                  $("input[name='harmRelationEvaluationBad']").get(1).checked = true;
                  $("input[name='harmRelationEvaluationBad'][value='否']").attr("disabled", false);
                }
                if (reportData.technologyIsHarmSituation === '无法确定') {
                  $("input[name='harmRelationEvaluationBad']").get(2).checked = true;
                  $("input[name='harmRelationEvaluationBad'][value='无法确定']").attr("disabled", false);
                }


                if (reportData.technologyProcessTip === '不符合报告标准') {
                  $("input[name='harmRelationEvaluationAd']").get(0).checked = true;
                  $("input[name='harmRelationEvaluationAd'][value='不符合报告标准']").attr("disabled", false);
                }
                if (reportData.technologyProcessTip === '继续监测') {
                  $("input[name='harmRelationEvaluationAd']").get(1).checked = true;
                  $("input[name='harmRelationEvaluationAd'][value='继续监测']").attr("disabled", false);
                }
                if (reportData.technologyProcessTip === '进一步处理') {
                  $("input[name='harmRelationEvaluationAd']").get(2).checked = true;
                  $("input[name='harmRelationEvaluationAd'][value='进一步处理']").attr("disabled", false);
                }

                $('.harm-textarea').val(reportData.technologyTipDescription);

              }

              //不良事件发生时间
              if (!isNull(reportData.harmHappenTimeSelect)) {
                if (reportData.harmHappenTimeSelect === '临床使用期间') {
                  $("input[name='harmTime']").get(0).checked = true;
                  $("input[value='临床使用期间']").attr("disabled", false);
                }
                if (reportData.harmHappenTimeSelect === '设备日常维护检测期间') {
                  $("input[name='harmTime']").get(1).checked = true;
                  $("input[value='设备日常维护检测期间']").attr("disabled", false);
                }
              }

              //不良事件过程描述-是否涉及造影机故障
              if (!isNull(reportData.harmCourseSelect)) {
                if (reportData.harmCourseSelect === '是') {
                  $("input[name='harmMachineSelf']").get(0).checked = true;
                  $("input[name='harmMachineSelf'][value='是']").attr("disabled", false);
                }
                if (reportData.harmCourseSelect === '否') {
                  $("input[name='harmMachineSelf']").get(1).checked = true;
                  $("input[name='harmMachineSelf'][value='否']").attr("disabled", false);
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
                  $("input[name='harmOperate'][value='不需处理自动恢复']").attr("disabled", false);
                }
                if (reportData.harmProcessSelect === '重启设备后恢复') {
                  $("input[name='harmOperate']").get(1).checked = true;
                  $("input[name='harmOperate'][value='重启设备后恢复']").attr("disabled", false);
                }
                if (reportData.harmProcessSelect === '更换设备短时暂停') {
                  $("input[name='harmOperate']").get(2).checked = true;
                  $("input[name='harmOperate'][value='更换设备短时暂停']").attr("disabled", false);
                  $('#J_harm_operate_during').val(reportData.harmProcessStopDuring);
                }
                if (reportData.harmProcessSelect === '手术中止维修设备') {
                  $("input[name='harmOperate']").get(3).checked = true;
                  $("input[name='harmOperate'][value='手术中止维修设备']").attr("disabled", false);
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
                  $("input[name='harmSerious'][value='对患者无影响']").attr("disabled", false);
                }
                if (reportData.harmLevelSelect === '一般') {
                  $("input[name='harmSerious']").get(1).checked = true;
                  $("input[name='harmSerious'][value='一般']").attr("disabled", false);
                }
                if (reportData.harmLevelSelect === '严重') {
                  $("input[name='harmSerious']").get(2).checked = true;
                  $("input[name='harmSerious'][value='严重']").attr("disabled", false);
                  if (!isNull(reportData.harmTerribleLevelSelect)) {
                    if (reportData.harmTerribleLevelSelect === '死亡') {
                      $("input[name='harmSeriousDetail']").get(0).checked = true;
                      $("input[name='harmSeriousDetail'][value='死亡']").attr("disabled", false);
                    }
                    if (reportData.harmTerribleLevelSelect === '危及生命') {
                      $("input[name='harmSeriousDetail']").get(1).checked = true;
                      $("input[name='harmSeriousDetail'][value='危及生命']").attr("disabled", false);
                    }
                    if (reportData.harmTerribleLevelSelect === '机体功能机构永久性损伤') {
                      $("input[name='harmSeriousDetail']").get(2).checked = true;
                      $("input[name='harmSeriousDetail'][value='机体功能机构永久性损伤']").attr("disabled", false);
                    }
                    if (reportData.harmTerribleLevelSelect === '需要内外科治疗避免上述永久损伤') {
                      $("input[name='harmSeriousDetail']").get(3).checked = true;
                      $("input[name='harmSeriousDetail'][value='需要内外科治疗避免上述永久损伤']").attr("disabled", false);
                    }
                  }
                }
              }
              //不良事件后果
              if (!isNull(reportData.harmResultSelect)) {
                if (reportData.harmResultSelect === '痊愈') {
                  $("input[name='harmResult']").get(0).checked = true;
                  $("input[name='harmResult'][value='痊愈']").attr("disabled", false);
                  $('#J_harm_gout_time').val(reportData.harmResultRecoveryTime);
                }
                if (reportData.harmResultSelect === '有后遗症') {
                  $("input[name='harmResult']").get(1).checked = true;
                  $("input[name='harmResult'][value='有后遗症']").attr("disabled", false);
                  $('#J_harm_sequel').val(reportData.harmResultSequela);
                }
                if (reportData.harmResultSelect === '死亡') {
                  $("input[name='harmResult']").get(2).checked = true;
                  $("input[name='harmResult'][value='死亡']").attr("disabled", false);
                  $('#J_harm_died_time').val(reportData.harmResultDiedTime);
                  $('#J_harm_died_reason').val(reportData.harmResultDiedReason);
                }
              }
              //对原患疾病的影响
              if (!isNull(reportData.harmOriginalSelect)) {
                if (reportData.harmOriginalSelect === '不明显') {
                  $("input[name='harmOriginal']").get(0).checked = true;
                  $("input[name='harmOriginal'][value='不明显']").attr("disabled", false);
                }
                if (reportData.harmOriginalSelect === '病程延长') {
                  $("input[name='harmOriginal']").get(1).checked = true;
                  $("input[name='harmOriginal'][value='病程延长']").attr("disabled", false);
                }
                if (reportData.harmOriginalSelect === '病情加重') {
                  $("input[name='harmOriginal']").get(2).checked = true;
                  $("input[name='harmOriginal'][value='病情加重']").attr("disabled", false);
                }
                if (reportData.harmOriginalSelect === '导致后遗症') {
                  $("input[name='harmOriginal']").get(3).checked = true;
                  $("input[name='harmOriginal'][value='导致后遗症']").attr("disabled", false);
                  $('#J_original_sequel').val(reportData.harmOriginalSequela);
                }
                if (reportData.harmOriginalSelect === '导致死亡') {
                  $("input[name='harmOriginal']").get(4).checked = true;
                  $("input[name='harmOriginal'][value='导致死亡']").attr("disabled", false);
                  $('#J_original_died_time').val(reportData.harmOriginalDiedTime);
                }
              }
              //不良事件关联性评价1
              if (!isNull(reportData.harmSelfRelativeEvaluate1)) {
                if (reportData.harmSelfRelativeEvaluate1 === '是') {
                  $("input[name='harmRelation1']").get(0).checked = true;
                  $("input[name='harmRelation1'][value='是']").attr("disabled", false);
                }
                if (reportData.harmSelfRelativeEvaluate1 === '否') {
                  $("input[name='harmRelation1']").get(1).checked = true;
                  $("input[name='harmRelation1'][value='否']").attr("disabled", false);
                }
              }
              //不良事件关联性评价2
              if (!isNull(reportData.harmSelfRelativeEvaluate2)) {
                if (reportData.harmSelfRelativeEvaluate2 === '是') {
                  $("input[name='harmRelation2']").get(0).checked = true;
                  $("input[name='harmRelation2'][value='是']").attr("disabled", false);
                }
                if (reportData.harmSelfRelativeEvaluate2 === '否') {
                  $("input[name='harmRelation2']").get(1).checked = true;
                  $("input[name='harmRelation2'][value='否']").attr("disabled", false);
                }
                if (reportData.harmSelfRelativeEvaluate2 === '无法确定') {
                  $("input[name='harmRelation2']").get(2).checked = true;
                  $("input[name='harmRelation2'][value='无法确定']").attr("disabled", false);
                }
              }
              //不良事件关联性评价3
              if (!isNull(reportData.harmSelfRelativeEvaluate3)) {
                if (reportData.harmSelfRelativeEvaluate3 === '是') {
                  $("input[name='harmRelation3']").get(0).checked = true;
                  $("input[name='harmRelation3'][value='是']").attr("disabled", false);
                }
                if (reportData.harmSelfRelativeEvaluate3 === '否') {
                  $("input[name='harmRelation3']").get(1).checked = true;
                  $("input[name='harmRelation3'][value='否']").attr("disabled", false);
                }
                if (reportData.harmSelfRelativeEvaluate3 === '无法确定') {
                  $("input[name='harmRelation3']").get(2).checked = true;
                  $("input[name='harmRelation3'][value='无法确定']").attr("disabled", false);
                }
              }
              //与数字减影血管造影机的因果关系评价
              if (!isNull(reportData.harmSelfRelativeResult)) {
                if (reportData.harmSelfRelativeResult === '很有可能') {
                  $("input[name='harmRelationResult']").get(0).checked = true;
                  $("input[name='harmRelationResult'][value='很有可能']").attr("disabled", false);
                }
                if (reportData.harmSelfRelativeResult === '可能有关') {
                  $("input[name='harmRelationResult']").get(1).checked = true;
                  $("input[name='harmRelationResult'][value='可能有关']").attr("disabled", false);
                }
                if (reportData.harmSelfRelativeResult === '可能无关') {
                  $("input[name='harmRelationResult']").get(2).checked = true;
                  $("input[name='harmRelationResult'][value='可能无关']").attr("disabled", false);
                }
                if (reportData.harmSelfRelativeResult === '无法确定') {
                  $("input[name='harmRelationResult']").get(3).checked = true;
                  $("input[name='harmRelationResult'][value='无法确定']").attr("disabled", false);
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

    //提交评价
    function submitEvaluateInfo(submitType, observeId, accidentId, evaluateBrief, evaluatorName, evaluatorId, superiorRelativeEvaluate1,
                                superiorRelativeEvaluate2, superiorRelativeEvaluate3, superiorRelativeResult,
                                technologyIsHarmSituation, technologyProcessTip, technologyTipDescription) {
      $.ajax({
        url: window.localStorage.backSystemUrl + '/submit/DSA/evaluate/report/by/observeId',
        headers: {
          Authorization: "Bearer " + window.localStorage.myTokenKey
        },
        method: 'get',
        data: {
          submitType: submitType,
          observeId: observeId,
          accidentId: accidentId,
          evaluateBrief: evaluateBrief,
          evaluatorName: evaluatorName,
          evaluatorId: evaluatorId,
          superiorRelativeEvaluate1: superiorRelativeEvaluate1,
          superiorRelativeEvaluate2: superiorRelativeEvaluate2,
          superiorRelativeEvaluate3: superiorRelativeEvaluate3,
          superiorRelativeResult: superiorRelativeResult,
          technologyIsHarmSituation: technologyIsHarmSituation,
          technologyProcessTip: technologyProcessTip,
          technologyTipDescription: technologyTipDescription
        },
        success: function (result) {
          let resultJson = JSON.parse(result);
          if (resultJson.successful && resultJson.object) {
            window.open('/report//submit/evaluate/result/page?observeId=' + observeId + '&submitType=' + submitType, '_self');
          } else {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error("操作失败，请稍后重试");
          }
          $('#J_submit_harm_review,#J_submit_observe_review').css("pointer-events", "auto");
        },
        error: function (error) {
          $('#J_network_modal').modal('show');
          $('#J_submit_harm_review,#J_submit_observe_review').css("pointer-events", "auto");
        }
      });

    }

    //绑定点击事件
    bindClickAction();
    function bindClickAction() {
      //禁用TAB的点击事件
      $('.bad-tab-li,.observe-tab-li').css("pointer-events", "none");

      //评价通过并提交：有不良事件报告表
      $('#J_submit_observe_review').on('click', function () {
        //不允许各项评价意见为空
        let submitType = '已评价';
        let observeId = $('input[name="ObserveReportId"]').val();
        let accidentId = $('input[name="AccidentReportId"]').val();
        let evaluateBrief = $('.evaluate-textarea').val();
        let evaluatorName = window.localStorage.fullNameKey;
        let evaluatorId = window.localStorage.userIdKey;


        if (isNull(submitType) || isNull(evaluateBrief)) {
          toastr.options.positionClass = 'toast-bottom-right';
          toastr.error("【评价意见】为必填项!");
        } else {
          $('#J_submit_observe_review').css("pointer-events", "none");
          submitEvaluateInfo(submitType, observeId, accidentId, evaluateBrief, evaluatorName, evaluatorId);
        }
      });

      //退回该报告:无不良事件报告表
      $('.reject-observe-button').on('click', function () {
        //不允许各项评价意见为空
        let submitType = '市级已退回'; //目前先写死为市级已退回
        let observeId = $('input[name="ObserveReportId"]').val();
        let accidentId = $('input[name="AccidentReportId"]').val();
        let evaluateBrief = $('.evaluate-textarea').val();
        let evaluatorName = window.localStorage.fullNameKey;
        let evaluatorId = window.localStorage.userIdKey;


        if (isNull(submitType) || isNull(evaluateBrief)) {
          toastr.options.positionClass = 'toast-bottom-right';
          toastr.error("【评价意见】为必填项!");
        } else {
          let html = deleteModalTemplate.render({observeId: observeId, accidentId: accidentId});
          $('.delete-one-modal-container').html(html);
          $('#J_delete_one_modal').modal({backdrop: 'static', keyboard: false});
          //删除确定按钮
          $('.delete-ok-button').on('click', function () {
            submitEvaluateInfo(submitType, observeId, accidentId, evaluateBrief, evaluatorName, evaluatorId);
          });
        }

      });

      //评价通过并提交：有不良事件报告表
      $('#J_submit_harm_review').on('click', function () {
        //不允许各项评价意见为空
        let submitType = '已评价';
        let observeId = $('input[name="ObserveReportId"]').val();
        let accidentId = $('input[name="AccidentReportId"]').val();
        let evaluateBrief = $('.evaluate-textarea').val();
        let evaluatorName = window.localStorage.fullNameKey;
        let evaluatorId = window.localStorage.userIdKey;
        let superiorRelativeEvaluate1 = $("input[name='harmRelationEvaluation1']:checked").val();
        let superiorRelativeEvaluate2 = $("input[name='harmRelationEvaluation2']:checked").val();
        let superiorRelativeEvaluate3 = $("input[name='harmRelationEvaluation3']:checked").val();
        let superiorRelativeResult = $("input[name='harmRelationEvaluationResult']:checked").val();
        let technologyIsHarmSituation = $("input[name='harmRelationEvaluationBad']:checked").val();
        let technologyProcessTip = $("input[name='harmRelationEvaluationAd']:checked").val();
        let technologyTipDescription = $('.harm-textarea').val();

        if (isNull(submitType) || isNull(superiorRelativeEvaluate1) || isNull(superiorRelativeEvaluate2) || isNull(superiorRelativeEvaluate3)
          || isNull(superiorRelativeResult) || isNull(technologyIsHarmSituation) || isNull(technologyProcessTip) || isNull(technologyTipDescription)) {
          toastr.options.positionClass = 'toast-bottom-right';
          toastr.error("请将【不良事件关联性评价】填写完整");
        } else {
          $('#J_submit_harm_review').css("pointer-events", "none");
          submitEvaluateInfo(submitType, observeId, accidentId, evaluateBrief, evaluatorName, evaluatorId, superiorRelativeEvaluate1,
            superiorRelativeEvaluate2, superiorRelativeEvaluate3, superiorRelativeResult,
            technologyIsHarmSituation, technologyProcessTip, technologyTipDescription);
        }
      });

      //退回该报告:有不良事件报告表
      $('.reject-button').on('click', function () {
        //不允许各项评价意见为空
        let submitType = '市级已退回'; //目前先写死为市级已退回
        let observeId = $('input[name="ObserveReportId"]').val();
        let accidentId = $('input[name="AccidentReportId"]').val();
        let evaluateBrief = $('.evaluate-textarea').val();
        let evaluatorName = window.localStorage.fullNameKey;
        let evaluatorId = window.localStorage.userIdKey;
        let superiorRelativeEvaluate1 = $("input[name='harmRelationEvaluation1']:checked").val();
        let superiorRelativeEvaluate2 = $("input[name='harmRelationEvaluation2']:checked").val();
        let superiorRelativeEvaluate3 = $("input[name='harmRelationEvaluation3']:checked").val();
        let superiorRelativeResult = $("input[name='harmRelationEvaluationResult']:checked").val();
        let technologyIsHarmSituation = $("input[name='harmRelationEvaluationBad']:checked").val();
        let technologyProcessTip = $("input[name='harmRelationEvaluationAd']:checked").val();
        let technologyTipDescription = $('.harm-textarea').val();

        if (isNull(submitType) || isNull(superiorRelativeEvaluate1) || isNull(superiorRelativeEvaluate2) || isNull(superiorRelativeEvaluate3)
          || isNull(superiorRelativeResult) || isNull(technologyIsHarmSituation) || isNull(technologyProcessTip) || isNull(technologyTipDescription)) {
          toastr.options.positionClass = 'toast-bottom-right';
          toastr.error("请将【不良事件关联性评价】填写完整");
        } else {
          let html = deleteModalTemplate.render({observeId: observeId, accidentId: accidentId});
          $('.delete-one-modal-container').html(html);
          $('#J_delete_one_modal').modal({backdrop: 'static', keyboard: false});
          //删除确定按钮
          $('.delete-ok-button').on('click', function () {
            submitEvaluateInfo(submitType, observeId, accidentId, evaluateBrief, evaluatorName, evaluatorId, superiorRelativeEvaluate1,
              superiorRelativeEvaluate2, superiorRelativeEvaluate3, superiorRelativeResult,
              technologyIsHarmSituation, technologyProcessTip, technologyTipDescription);
          });
        }

      });


      //继续评价不良事件报告表
      $('#J_continue_harm_review').on('click', function () {
        //不允许评价意见为空
        let evaluateBrief = $('.evaluate-textarea').val();
        if (isNull(evaluateBrief)) {
          toastr.options.positionClass = 'toast-bottom-right';
          toastr.error("【评价意见】为必填项!");
        } else {
          $('a[href="#tab2"]').click();
          $(window).scrollTop(0);
          $('body').scrollTop(0);
          $('html').scrollTop(0);
        }
      });

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
    }


  })(jQuery);
});
