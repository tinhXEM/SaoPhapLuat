import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StatusBar} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  ModalTick,
  ModalFontsize,
  ModalTheme,
  ModalFontFamily,
} from '@components/ModalComponent';
import {styles} from './styles';
import {useNavigation, useRoute} from '@react-navigation/native';
import ContentComponent from '@components/ContentComponent/ContentComponent';
import {
  IChangeThemeColorReducer,
  IChangeThemeFontFamilyReducer,
  IChangeThemeFontSizeReducer,
} from '@models/reducers/changeTheme';
import {useDispatch, useSelector} from 'react-redux';
import HeaderDetail from '@components/HeaderComponent/HeaderDetail/HeaderDetail';
import ViewLineComponent from '@components/ViewLineComponent/ViewLineComponent';
import {colorGlobal} from '@config/colorGlobal';
import {IDetailNewsReducer} from '@store/reducers/detailNewsReducer';
import {Actions} from '@store/actions';
import {
  IDataDetailNews,
  IGetParamsDetailRequest,
} from '@models/actions/getDetailNews';
import {IDataTick} from '@models/reducers/dataTick';
import ImagePlaceholderDetail from '@components/ImagePlaceholder/ImagePlaceholderDetail';
import {hasNotch} from '@freakycoder/react-native-helpers';

interface IChangeFontReducer {
  ChangeFontReducer: IChangeThemeFontFamilyReducer &
    IChangeThemeFontSizeReducer;
}
interface IColorThemeReducer {
  ChangeThemeColorReducer: IChangeThemeColorReducer;
}
interface INewsReducer {
  detailNewsReducer: IDetailNewsReducer;
}

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [itemDetail, setItemsDetail] = useState<IDataTick>();

  const ChangeFontReducer = useSelector(
    (state: IChangeFontReducer) => state.ChangeFontReducer,
  );
  const colorTheme = useSelector(
    (state: IColorThemeReducer) => state.ChangeThemeColorReducer.color,
  );

  const {font, fontSize} = ChangeFontReducer;
  const dispatch = useDispatch();
  useEffect(() => {
    if (route.params !== undefined) {
      dispatch(
        Actions.getDetailNewsRequestActions(
          route.params as IGetParamsDetailRequest,
        ),
      );
    }
  }, []);
  const detailNewsReducer = useSelector(
    (state: INewsReducer) => state.detailNewsReducer,
  );
  const {isLoading, dataDetailNews} = detailNewsReducer;
  useEffect(() => {
    setItemsDetail(dataDetailNews);
  }, [isLoading]);

  const refRBSheet = useRef<any>();
  const [showModal, setShowModal] = useState(false);
  return (
    <View style={[styles.container, styles.backgroundDetail(showModal)]}>
      {!isLoading ? (
        <HeaderDetail
          styleHeader={{
            backgroundColor: !showModal
              ? colorGlobal.backgroundGlobal
              : colorGlobal.backgroundModal,
          }}
          lineHeader={!showModal}
          isButtonLeft={true}
          isButtonCenter={true}
          title={dataDetailNews.cat_name}
          isButtonRight={true}
          headerLeft={() => navigation.goBack()}
          headerRight={() => refRBSheet.current?.open()}
          iconRight={{
            uri: 'https://icon-library.com/images/icon-other/icon-other-26.jpg',
          }}
          iconRightStyle={{width: 30, height: 20, resizeMode: 'stretch'}}
          buttonRightStyle={{
            padding: 5,
          }}
        />
      ) : null}
      {/* CONTENT COMPONENT */}
      {!isLoading ? (
        <ContentComponent dataDetail={dataDetailNews} />
      ) : (
        <ImagePlaceholderDetail />
      )}
      {!isLoading && itemDetail !== null && (
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={400}
          onClose={() => setShowModal(false)}
          onOpen={() => setShowModal(true)}
          openDuration={150}
          closeDuration={150}
          animationType={'slide'}
          customStyles={{
            draggableIcon: {
              backgroundColor: colorGlobal.lineColor,
            },
            container: {borderTopLeftRadius: 15, borderTopRightRadius: 15},
            wrapper: {
              backgroundColor: 'transparent',
            },
          }}>
          <View style={styles.viewModal}>
            <ModalTick
              title={'Đánh dấu'}
              font={font}
              fontSize={fontSize}
              colorTheme={colorTheme}
              items={[itemDetail] as IDataTick[]}
            />
            <ModalTheme title={'Màu sắc'} font={font} fontSize={fontSize} />
            <ModalFontsize
              title={'Cỡ chữ'}
              font={font}
              colorSlider={colorTheme}
            />
            <ModalFontFamily
              title={'Phông chữ'}
              font={font}
              fontSize={fontSize}
            />
          </View>
          <View style={styles.viewFooter}>
            <ViewLineComponent />
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => refRBSheet.current?.close()}>
              <Text style={styles.labelClose}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      )}
    </View>
  );
};

export default DetailScreen;
