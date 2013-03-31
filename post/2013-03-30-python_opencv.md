# python使用python进行人脸识别

### 环境

- `ubuntu 12.04 LTS`
- `python 2.7.3`
- `opencv 2.3.1-7`


### 安装依赖

```bash
sudo apt-get install libopencv-*
sudo apt-get install python-opencv
sudo apt-get install python-numpy
```


### 示例代码

```python
#!/usr/bin/env python
#coding=utf-8
import os
from PIL import Image, ImageDraw
import cv

def detect_object(image):
    '''检测图片，获取人脸在图片中的坐标'''
    grayscale = cv.CreateImage((image.width, image.height), 8, 1)
    cv.CvtColor(image, grayscale, cv.CV_BGR2GRAY)

    cascade = cv.Load("/usr/share/opencv/haarcascades/haarcascade_frontalface_alt_tree.xml")
    rect = cv.HaarDetectObjects(grayscale, cascade, cv.CreateMemStorage(), 1.1, 2,
        cv.CV_HAAR_DO_CANNY_PRUNING, (20,20))

    result = []
    for r in rect:
        result.append((r[0][0], r[0][1], r[0][0]+r[0][2], r[0][1]+r[0][3]))

    return result

def process(infile):
    '''在原图上框出头像并且截取每个头像到单独文件夹'''
    image = cv.LoadImage(infile);
    if image:
        faces = detect_object(image)

    im = Image.open(infile)
    path = os.path.abspath(infile)
    save_path = os.path.splitext(path)[0]+"_face"
    try:
        os.mkdir(save_path)
    except:
        pass
    if faces:
        draw = ImageDraw.Draw(im)
        count = 0
        for f in faces:
            count += 1
            draw.rectangle(f, outline=(255, 0, 0))
            a = im.crop(f)
            file_name = os.path.join(save_path,str(count)+".jpg")
     #       print file_name
            a.save(file_name)

        drow_save_path = os.path.join(save_path,"out.jpg")
        im.save(drow_save_path, "JPEG", quality=80)
    else:
        print "Error: cannot detect faces on %s" % infile

if __name__ == "__main__":
    process("./opencv_in.jpg")
```


### 转换效果

##### 原图：
![输入图片](./images/opencv_in.jpg)

##### 转换后
![输出图片](./images/opencv_out.jpg)


### 使用感受

对于大部分图像来说，只要是头像是正面的，没有被阻挡，识别基本没问题，准确性还是很高的。

识别效率有点低，有时候一张图片能处理七八秒才能处理完，当然这个和机器配置有关。
如果想加速的话可以使用C语言重写，经测试，C语言版的所花时间大约是python的一半

另外，官方提供了几个库可一选择，这里使用的是`haarcascade_frontalface_alt_tree.xml`，
除此之外，`/usr/share/opencv/haarcascades/`文件夹下还有几个库：

```
~~/usr/share/opencv/haarcascades>> ll -h
总用量 19M
drwxr-xr-x 2 root root  4.0K  3月 22 17:14 ./
drwxr-xr-x 4 root root  4.0K  3月 22 17:14 ../
-rw-r--r-- 1 root root  1.1M  4月 28  2011 haarcascade_eye_tree_eyeglasses.xml
-rw-r--r-- 1 root root  495K  4月 28  2011 haarcascade_eye.xml
-rw-r--r-- 1 root root  818K  4月 28  2011 haarcascade_frontalface_alt2.xml
-rw-r--r-- 1 root root  3.5M  4月 28  2011 haarcascade_frontalface_alt_tree.xml
-rw-r--r-- 1 root root  899K  4月 28  2011 haarcascade_frontalface_alt.xml
-rw-r--r-- 1 root root  1.2M  4月 28  2011 haarcascade_frontalface_default.xml
-rw-r--r-- 1 root root  622K  4月 28  2011 haarcascade_fullbody.xml
-rw-r--r-- 1 root root  316K  4月 28  2011 haarcascade_lefteye_2splits.xml
-rw-r--r-- 1 root root  520K  4月 28  2011 haarcascade_lowerbody.xml
-rw-r--r-- 1 root root  350K  4月 28  2011 haarcascade_mcs_eyepair_big.xml
-rw-r--r-- 1 root root  401K  4月 28  2011 haarcascade_mcs_eyepair_small.xml
-rw-r--r-- 1 root root  306K  8月  2  2011 haarcascade_mcs_leftear.xml
-rw-r--r-- 1 root root  760K  4月 28  2011 haarcascade_mcs_lefteye.xml
-rw-r--r-- 1 root root  703K  4月 28  2011 haarcascade_mcs_mouth.xml
-rw-r--r-- 1 root root  1.6M  4月 28  2011 haarcascade_mcs_nose.xml
-rw-r--r-- 1 root root  318K  8月  2  2011 haarcascade_mcs_rightear.xml
-rw-r--r-- 1 root root  1.4M  4月 28  2011 haarcascade_mcs_righteye.xml
-rw-r--r-- 1 root root  1.5M  4月 28  2011 haarcascade_mcs_upperbody.xml
-rw-r--r-- 1 root root  1.1M  4月 28  2011 haarcascade_profileface.xml
-rw-r--r-- 1 root root  317K  4月 28  2011 haarcascade_righteye_2splits.xml
-rw-r--r-- 1 root root 1022K  4月 28  2011 haarcascade_upperbody.xml
~/usr/share/opencv/haarcascades>> 
```

根据文件名大家应该能知道是识别什么的。值得一提的是，这里面有四个关于人脸（frontalface）的识别库，
根据我的使用体验，`default`这个xml识别的最多，这就意味着本来不是头像的也识别成头像了。
`alt_tree`这个库虽然是最大的，但并不意味着这个库是最好的，应该说，用这个库，识别是最严格的，
这就意味着，有些头像不能被识别，因为根据他的算法，他认为这不是头像。
其余两个和`alt_tree`差不多。具体识别细节大家可以打开相应的xml看一下。

上面的代码只是识别面部，并不包括头发，如果大家想抓一个完整的头像的话，
可以将识别出来的矩形框的上边缘增加一定的比例，比如增加20%头像的高度。

### 附：C++语言人脸识别代码

网上找的，亲测可用，效率比python高一点。

```cpp
#include "cv.h"
#include "highgui.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <math.h>
#include <float.h>
#include <limits.h>
#include <time.h>
#include <ctype.h>
#ifdef _EiC
#define WIN32
#endif
static CvMemStorage* storage = 0;
static CvHaarClassifierCascade* cascade = 0;
void detect_and_draw( IplImage* image );
const char* cascade_name =
"haarcascade_frontalface_alt.xml";
/*    "haarcascade_profileface.xml";*/
int main( int argc, char** argv )
{
    CvCapture* capture = 0;
    IplImage *frame, *frame_copy = 0;
    int optlen = strlen("--cascade=");
    const char* input_name;
    if( argc > 1 && strncmp( argv[1], "--cascade=", optlen ) == 0 )
    {
        cascade_name = argv[1] + optlen;
        input_name = argc > 2 ? argv[2] : 0;
    }
    else
    {
        cascade_name = "/usr/share/opencv/haarcascades/haarcascade_frontalface_default.xml";
        //opencv装好后haarcascade_frontalface_alt2.xml的路径,
        //也可以把这个文件拷到你的工程文件夹下然后不用写路径名cascade_name= "haarcascade_frontalface_alt2.xml";  
        //或者cascade_name ="C:\\Program Files\\OpenCV\\data\\haarcascades\\haarcascade_frontalface_alt2.xml"
        input_name = argc > 1 ? argv[1] : 0;
    }
    cascade = (CvHaarClassifierCascade*)cvLoad( cascade_name, 0, 0, 0 );
    if( !cascade )
    {
        fprintf( stderr, "ERROR: Could not load classifier cascade\n" );
        fprintf( stderr,
                "Usage: facedetect --cascade=\"<cascade_path>\" [filename|camera_index]\n" );
        return -1;
    }
    storage = cvCreateMemStorage(0);
    if( !input_name || (isdigit(input_name[0]) && input_name[1] == '\0') )
    capture = cvCaptureFromCAM( !input_name ? 0 : input_name[0] - '0' );
    else
    capture = cvCaptureFromAVI( input_name ); 
    cvNamedWindow( "result", 1 );
    if( capture )
    {
        for(;;)
        {
            if( !cvGrabFrame( capture ))
            break;
            frame = cvRetrieveFrame( capture );
            if( !frame )
            break;
            if( !frame_copy )
            frame_copy = cvCreateImage( cvSize(frame->width,frame->height),
                                       IPL_DEPTH_8U, frame->nChannels );
            if( frame->origin == IPL_ORIGIN_TL )
            cvCopy( frame, frame_copy, 0 );
            else
            cvFlip( frame, frame_copy, 0 );
            detect_and_draw( frame_copy );
            if( cvWaitKey( 10 ) >= 0 )
            break;
        }
        cvReleaseImage( &frame_copy );
        cvReleaseCapture( &capture );
    }
    else
    {
        const char* filename = input_name ? input_name : (char*)"lena.jpg";
        IplImage* image = cvLoadImage( filename, 1 );
        if( image )
        {
            detect_and_draw( image );
            cvWaitKey(0);
            cvReleaseImage( &image );
        }
        else
        {
            /* assume it is a text file containing the
            list of the image filenames to be processed - one per line */
            FILE* f = fopen( filename, "rt" );
            if( f )
            {
                char buf[1000+1];
                while( fgets( buf, 1000, f ) )
                {
                    int len = (int)strlen(buf);
                    while( len > 0 && isspace(buf[len-1]) )
                    len--;
                    buf[len] = '\0';
                    image = cvLoadImage( buf, 1 );
                    if( image )
                    {
                        detect_and_draw( image );
                        cvWaitKey(0);
                        cvReleaseImage( &image );
                    }
                }
                fclose(f);
            }
        }
    }
    //    getchar();
    cvDestroyWindow("result");
    return 0;
}
void detect_and_draw( IplImage* img )
{
    static CvScalar colors[] = 
    {
        {{0,0,255}},
        {{0,128,255}},
        {{0,255,255}},
        {{0,255,0}},
        {{255,128,0}},
        {{255,255,0}},
        {{255,0,0}},
        {{255,0,255}}
    };
    double scale = 1.3;
    IplImage* gray = cvCreateImage( cvSize(img->width,img->height), 8, 1 );
    IplImage* small_img = cvCreateImage( cvSize( cvRound (img->width/scale),
                                                cvRound (img->height/scale)),
                                        8, 1 );
    int i;
    cvCvtColor( img, gray, CV_BGR2GRAY );
    cvResize( gray, small_img, CV_INTER_LINEAR );
    cvEqualizeHist( small_img, small_img );
    cvClearMemStorage( storage );
    if( cascade )
    {
        double t = (double)cvGetTickCount();
        CvSeq* faces = cvHaarDetectObjects( small_img, cascade, storage,
                                           1.1, 2, 0/*CV_HAAR_DO_CANNY_PRUNING*/,
                                           cvSize(30, 30) );
        t = (double)cvGetTickCount() - t;
        printf( "detection time = %gms\n", t/((double)cvGetTickFrequency()*1000.) );
        for( i = 0; i < (faces ? faces->total : 0); i++ )
        {
            CvRect* r = (CvRect*)cvGetSeqElem( faces, i );
            CvPoint center;
            int radius;
            center.x = cvRound((r->x + r->width*0.5)*scale);
            center.y = cvRound((r->y + r->height*0.5)*scale);
            radius = cvRound((r->width + r->height)*0.25*scale);
            cvCircle( img, center, radius, colors[i%8], 3, 8, 0 );
        }
    }
    cvShowImage( "result", img );
    cvReleaseImage( &gray );
    cvReleaseImage( &small_img );
}

```
