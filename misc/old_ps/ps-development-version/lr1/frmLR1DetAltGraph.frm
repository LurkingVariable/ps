VERSION 5.00
Object = "{F9043C88-F6F2-101A-A3C9-08002B2F49FB}#1.2#0"; "COMDLG32.OCX"
Object = "{335C3C4F-E3F2-11D0-87E8-00A0C903B29D}#5.1#0"; "Vcfi5.ocx"
Begin VB.Form frmLR1DetAltGraph 
   Caption         =   "Linear Regression 1 Detectable Alternative:  Graphics Window"
   ClientHeight    =   8070
   ClientLeft      =   5445
   ClientTop       =   3825
   ClientWidth     =   8805
   LinkTopic       =   "Form1"
   ScaleHeight     =   8070
   ScaleWidth      =   8805
   WhatsThisButton =   -1  'True
   WhatsThisHelp   =   -1  'True
   Begin VtChartLib.VtChart VtChartDetAlt 
      Height          =   4095
      Left            =   120
      TabIndex        =   30
      Top             =   3360
      Width           =   8535
      _ExtentX        =   15055
      _ExtentY        =   7223
      _0              =   $"frmLR1DetAltGraph.frx":0000
      _1              =   $"frmLR1DetAltGraph.frx":0409
      _2              =   $"frmLR1DetAltGraph.frx":0812
      _3              =   $"frmLR1DetAltGraph.frx":0C1B
      _4              =   $"frmLR1DetAltGraph.frx":1024
      _5              =   $"frmLR1DetAltGraph.frx":142D
      _6              =   $"frmLR1DetAltGraph.frx":1836
      _7              =   $"frmLR1DetAltGraph.frx":1C3F
      _8              =   $"frmLR1DetAltGraph.frx":2048
      _9              =   $"frmLR1DetAltGraph.frx":2451
      _10             =   $"frmLR1DetAltGraph.frx":285A
      _11             =   $"frmLR1DetAltGraph.frx":2C63
      _12             =   $"frmLR1DetAltGraph.frx":306C
      _13             =   $"frmLR1DetAltGraph.frx":3475
      _count          =   14
      _ver            =   2
   End
   Begin VB.CommandButton btn_clear 
      Caption         =   "Clear"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   7200
      TabIndex        =   29
      Top             =   1440
      Width           =   975
   End
   Begin VB.TextBox LR1N 
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   975
      TabIndex        =   20
      Top             =   2760
      Visible         =   0   'False
      WhatsThisHelpID =   208
      Width           =   975
   End
   Begin VB.TextBox LR1Sigma 
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   3135
      TabIndex        =   19
      Top             =   1800
      Visible         =   0   'False
      WhatsThisHelpID =   210
      Width           =   975
   End
   Begin VB.TextBox LR1Lambda 
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   3135
      TabIndex        =   18
      Top             =   2760
      Visible         =   0   'False
      WhatsThisHelpID =   209
      Width           =   975
   End
   Begin VB.TextBox LR1Power 
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   975
      TabIndex        =   17
      Top             =   2310
      Visible         =   0   'False
      WhatsThisHelpID =   207
      Width           =   975
   End
   Begin VB.TextBox LR1Alpha 
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   975
      TabIndex        =   16
      Top             =   1830
      Visible         =   0   'False
      WhatsThisHelpID =   206
      Width           =   975
   End
   Begin VB.TextBox LR1SD 
      BackColor       =   &H00FFFFFF&
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   3120
      TabIndex        =   15
      Top             =   2280
      Visible         =   0   'False
      WhatsThisHelpID =   217
      Width           =   975
   End
   Begin VB.CommandButton btnCopy 
      Caption         =   "Copy"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   6120
      TabIndex        =   14
      Top             =   2040
      Width           =   975
   End
   Begin MSComDlg.CommonDialog dialogSaveAs 
      Left            =   6360
      Top             =   1320
      _ExtentX        =   847
      _ExtentY        =   847
      _Version        =   393216
   End
   Begin VB.CommandButton btnPrint 
      Caption         =   "Print"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   6120
      TabIndex        =   6
      Top             =   2640
      Width           =   975
   End
   Begin VB.CommandButton btnPlot 
      Caption         =   "Plot"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   5040
      TabIndex        =   5
      Top             =   2640
      Width           =   975
   End
   Begin VB.CommandButton btnExit 
      Caption         =   "Back"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   7200
      TabIndex        =   9
      Top             =   2640
      Width           =   975
   End
   Begin VB.CommandButton btnSave 
      Caption         =   "Save"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   7200
      TabIndex        =   7
      Top             =   2040
      Width           =   975
   End
   Begin VB.TextBox yHigh 
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   5520
      TabIndex        =   4
      Top             =   1440
      Width           =   735
   End
   Begin VB.TextBox yLow 
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   4560
      TabIndex        =   3
      Top             =   1440
      Width           =   735
   End
   Begin VB.TextBox xHigh 
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   5520
      TabIndex        =   2
      Top             =   960
      Width           =   735
   End
   Begin VB.TextBox xLow 
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   4560
      TabIndex        =   1
      Top             =   960
      Width           =   735
   End
   Begin VB.ComboBox cboAxisContent 
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   360
      Left            =   4560
      Style           =   2  'Dropdown List
      TabIndex        =   0
      Top             =   480
      Width           =   3375
   End
   Begin VB.Label Label1 
      Caption         =   "Right click on the graph to adjust its appearence."
      Height          =   255
      Left            =   360
      TabIndex        =   31
      Top             =   7440
      Width           =   4335
   End
   Begin VB.Label lblPlotAtRemind 
      Height          =   735
      Left            =   4560
      TabIndex        =   27
      Top             =   1920
      Visible         =   0   'False
      Width           =   1335
   End
   Begin VB.Label lblLR1SDx 
      Caption         =   "x"
      BeginProperty Font 
         Name            =   "Times New Roman"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   375
      Left            =   2925
      TabIndex        =   26
      Top             =   2430
      Visible         =   0   'False
      Width           =   255
   End
   Begin VB.Label lblLR1N 
      Alignment       =   1  'Right Justify
      Caption         =   "n"
      BeginProperty Font 
         Name            =   "Times New Roman"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   -1  'True
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   375
      Left            =   255
      TabIndex        =   25
      Top             =   2790
      Visible         =   0   'False
      WhatsThisHelpID =   208
      Width           =   615
   End
   Begin VB.Label lblLR1Sigma 
      Caption         =   "s"
      BeginProperty Font 
         Name            =   "Symbol"
         Size            =   12
         Charset         =   2
         Weight          =   400
         Underline       =   -1  'True
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   375
      Left            =   2725
      TabIndex        =   24
      Top             =   1815
      Visible         =   0   'False
      WhatsThisHelpID =   210
      Width           =   495
   End
   Begin VB.Label lblLR1Lambda 
      Caption         =   "l"
      BeginProperty Font 
         Name            =   "Symbol"
         Size            =   12
         Charset         =   2
         Weight          =   400
         Underline       =   -1  'True
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   375
      Left            =   2725
      TabIndex        =   23
      Top             =   2790
      Visible         =   0   'False
      WhatsThisHelpID =   209
      Width           =   405
   End
   Begin VB.Label lblLR1Power 
      Alignment       =   1  'Right Justify
      Caption         =   "power"
      BeginProperty Font 
         Name            =   "Times New Roman"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   -1  'True
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   375
      Left            =   135
      TabIndex        =   22
      Top             =   2310
      Visible         =   0   'False
      WhatsThisHelpID =   207
      Width           =   735
   End
   Begin VB.Label lblLR1Alpha 
      Alignment       =   1  'Right Justify
      Caption         =   "a"
      BeginProperty Font 
         Name            =   "Symbol"
         Size            =   12
         Charset         =   2
         Weight          =   400
         Underline       =   -1  'True
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   375
      Left            =   0
      TabIndex        =   21
      Top             =   1800
      Visible         =   0   'False
      WhatsThisHelpID =   206
      Width           =   855
   End
   Begin VB.Label lblgraph 
      Caption         =   "Detectable difference graphs for linear regression (1 treatment)"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   -1  'True
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   255
      Index           =   0
      Left            =   240
      TabIndex        =   13
      Top             =   120
      Width           =   5775
   End
   Begin VB.Line Line1 
      X1              =   120
      X2              =   8160
      Y1              =   0
      Y2              =   0
   End
   Begin VB.Label lblFootnoteDefinition 
      Caption         =   "Parameter definitions"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   -1  'True
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   375
      Left            =   6000
      TabIndex        =   12
      Top             =   120
      Width           =   2055
   End
   Begin VB.Label lblyRange 
      Caption         =   "Y axis range"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   240
      TabIndex        =   11
      Top             =   1440
      Width           =   4215
   End
   Begin VB.Label lblgraph 
      Caption         =   "X axis  range (difference in slope)"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Index           =   2
      Left            =   240
      TabIndex        =   10
      Top             =   960
      Width           =   4215
   End
   Begin VB.Label lblgraph 
      Caption         =   "What should be on the Y axis?"
      BeginProperty Font 
         Name            =   "Arial"
         Size            =   9.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Index           =   1
      Left            =   240
      TabIndex        =   8
      Top             =   480
      Width           =   4215
   End
   Begin VB.Label lblLR1SD 
      Caption         =   "s"
      BeginProperty Font 
         Name            =   "Symbol"
         Size            =   12
         Charset         =   2
         Weight          =   400
         Underline       =   -1  'True
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   375
      Left            =   2725
      TabIndex        =   28
      Top             =   2310
      Visible         =   0   'False
      WhatsThisHelpID =   217
      Width           =   375
   End
   Begin VB.Menu mnuFile 
      Caption         =   "File"
      Begin VB.Menu mnuSave 
         Caption         =   "Save"
      End
      Begin VB.Menu mnuPrint 
         Caption         =   "Print"
      End
      Begin VB.Menu mnuExit 
         Caption         =   "Exit"
      End
   End
   Begin VB.Menu mnuHelp 
      Caption         =   "Help"
      Begin VB.Menu mnuHelpContents 
         Caption         =   "Help contents"
      End
      Begin VB.Menu mnuOverview 
         Caption         =   "Overview"
      End
      Begin VB.Menu mnuGraphics 
         Caption         =   "Graphics"
      End
      Begin VB.Menu mnuAboutPS 
         Caption         =   "About PS"
      End
   End
End
Attribute VB_Name = "frmLR1DetAltGraph"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Const epsilon As Single = 0.0001
Const POWER As String = "Power"
Const ss As String = "Sample size"
    Dim ALPHA As Single, numPower As Single, DIFF As Single, SIGMA As Single, M As Single, N As Single
    Dim lambda As Single, D_LAMBDA As Single, D_GAMMA As Single
    Dim NTR As Long, XBAR(0 To 1) As Single, SX(0 To 1) As Single, SLOPES As Long
'Dim numPlotAt As Single
Dim PlotAtChangeFlag As Boolean
Dim maxRowCount As Integer, realRowCount(20) As Integer
Dim PlotChangeVar As String
Dim PlotChangeValue As Single
Dim PlotChangePrevValue As Single
Dim numSeriesCount As Long
    Dim itype As Long

Private Sub btn_clear_Click()
    Unload Me
    frmLR1DetAltGraph.Show vbModal

End Sub

Private Sub lblFootnoteDefinition_Click()
    ShowHelpMapNumber 1, 409

End Sub

Private Sub lblLR1Alpha_Click()
    ' Call DisplayHelp(lblLR1Alpha.WhatsThisHelpID)
    'ShowHelpMapNumber 1, 421
    ShowHelpMapNumber 1, 409
End Sub

Private Sub lblLR1Lambda_Click()
    ' Call DisplayHelp(lblLR1Lambda.WhatsThisHelpID)
    'ShowHelpMapNumber 1, 426
    ShowHelpMapNumber 1, 409
End Sub

Private Sub lblLR1N_Click()
    ' Call DisplayHelp(lblLR1N.WhatsThisHelpID)
    'ShowHelpMapNumber 1, 428
    ShowHelpMapNumber 1, 409
End Sub

Private Sub lblLR1Power_Click()
    ' Call DisplayHelp(lblLR1Power.WhatsThisHelpID)
    'ShowHelpMapNumber 1, 430
    ShowHelpMapNumber 1, 409
End Sub

Private Sub lblLR1SD_Click()
    ' Call DisplayHelp(lblLR1SD.WhatsThisHelpID)
    'ShowHelpMapNumber 1, 440
    ShowHelpMapNumber 1, 409
End Sub

Private Sub lblLR1Sigma_Click()
    ' Call DisplayHelp(lblLR1Sigma.WhatsThisHelpID)
    'ShowHelpMapNumber 1, 442
    ShowHelpMapNumber 1, 409
End Sub



Private Sub LR1Alpha_Change()
    If IsNumeric(LR1Alpha.Text) Then ALPHA = CSng(LR1Alpha.Text)
    PlotAtChangeFlag = True
    LR1Alpha.Tag = 1
    PlotChangeValue = ALPHA
    VtChartDetAlt.Footnote.VtFont.Name = "Symbol"
    PlotChangeVar = "a"
End Sub

Private Sub LR1Alpha_GotFocus()
    If numSeriesCount = 1 Then PlotChangePrevValue = ALPHA

End Sub

Private Sub LR1Lambda_Change()
    If IsNumeric(LR1Lambda.Text) Then lambda = CSng(LR1Lambda.Text)
    PlotAtChangeFlag = True
    LR1Lambda.Tag = 1
    PlotChangeValue = lambda
    VtChartDetAlt.Footnote.VtFont.Name = "Symbol"
    PlotChangeVar = "l"

End Sub

Private Sub LR1Lambda_GotFocus()
    If numSeriesCount = 1 Then PlotChangePrevValue = lambda

End Sub

Private Sub LR1N_Change()
    If IsNumeric(LR1N.Text) Then N = CSng(LR1N.Text)
    PlotAtChangeFlag = True
    LR1N.Tag = 1
    PlotChangeValue = N
    VtChartDetAlt.Footnote.VtFont.Name = "Arial"
    PlotChangeVar = "n"

End Sub

Private Sub LR1N_GotFocus()
    If numSeriesCount = 1 Then PlotChangePrevValue = N

End Sub

Private Sub LR1Power_Change()
    If IsNumeric(LR1Power.Text) Then numPower = CSng(LR1Power.Text)
    PlotAtChangeFlag = True
    LR1Power.Tag = 1
    PlotChangeValue = numPower
    VtChartDetAlt.Footnote.VtFont.Name = "Arial"
    PlotChangeVar = "power"

End Sub

Private Sub LR1Power_GotFocus()
    If numSeriesCount = 1 Then PlotChangePrevValue = numPower

End Sub

Private Sub LR1SD_Change()
    If IsNumeric(LR1SD.Text) Then SX(0) = CSng(LR1SD.Text)
    PlotAtChangeFlag = True
    LR1SD.Tag = 1
    PlotChangeValue = SX(0)
    VtChartDetAlt.Footnote.VtFont.Name = "Symbol"
    PlotChangeVar = "sc"

End Sub

Private Sub LR1SD_GotFocus()
    If numSeriesCount = 1 Then PlotChangePrevValue = SX(0)

End Sub

Private Sub LR1Sigma_Change()
    If IsNumeric(LR1Sigma.Text) Then SIGMA = CSng(LR1Sigma.Text)
    PlotAtChangeFlag = True
    LR1Sigma.Tag = 1
    PlotChangeValue = SIGMA
    VtChartDetAlt.Footnote.VtFont.Name = "Symbol"
    PlotChangeVar = "s"

End Sub

Private Sub LR1Sigma_GotFocus()
    If numSeriesCount = 1 Then PlotChangePrevValue = SIGMA

End Sub

Private Sub xHigh_Change()
    Call CheckForEnable(Me)
End Sub

Private Sub xLow_Change()
    Call CheckForEnable(Me)
End Sub

Private Sub yHigh_Change()
    Call CheckForEnable(Me)
End Sub

Private Sub yLow_Change()
    Call CheckForEnable(Me)
End Sub

Private Sub btnCopy_Click()
    VtChartDetAlt.EditCopy

End Sub

Private Sub btnExit_Click()
    Unload Me
End Sub

Private Sub btnPlot_Click()
Dim numxLow As Single, numxHigh As Single, numyLow As Single, numyHigh As Single
Dim xmin As Single, xmax As Single
'
'  Set up for the plot.
'
    numxLow = CSng(xLow.Text)
    numxHigh = CSng(xHigh.Text)
    numyLow = CSng(yLow.Text)
    numyHigh = CSng(yHigh.Text)
    
    VtChartDetAlt.Legend.Location.Visible = True
    
'    VtChartDetAlt.Legend.Location.Visible = True
'    VtChartDetAlt.Legend.Location.LocationType = VtChLocationTypeRight
'    VtChartDetAlt.Footnote.Location.Visible = True
'    VtChartDetAlt.Footnote.Location.LocationType = VtChLocationTypeBottom
'    VtChartDetAlt.Footnote.Text = "alpha=" + Format(ALPHA) + " lambda=" + Format(lambda) + " sigma=" + Format(SIGMA)
'    VtChartDetAlt.Footnote.Font.Size = 10
'    VtChartDetAlt.Footnote.Text = "alpha=" + Format(ALPHA) + " power=" + Format(numPower) + " lambda=" + Format(lambda) + " sigma=" + Format(SIGMA) + " N=" + Format(N) + " sx(0)=" + Format(SX(0))
    If PlotAtChangeFlag Then
        numSeriesCount = numSeriesCount + 1
        PlotAtChangeFlag = False
    End If
'
'   Check x-axis (detectable alternative) range values.
'
    If Not (numxLow < numxHigh) Then
        Call PresentMessage(9)
        xLow.Text = Empty
        xHigh.Text = Empty
        Exit Sub
    End If
'
'  Produce the plot - Y axis is POWER or SS.
'
    If cboAxisContent.Text = ss Then
'
'   Check Y axis (sample size) range.
'
        If numyLow < 0 Or numyHigh < 0 Or Not (numyLow < numyHigh) Then
            Call PresentMessage(10)
            yLow.Text = Empty
            yHigh.Text = Empty
            Exit Sub
        End If
'
'   Set point on X axis (its minimum) where the Y axis intersects.
'
        Call SetYAxisIntersection(VtChartDetAlt, numxLow)
        Call plotDetAltSS(numxLow, numxHigh, numyLow, numyHigh)
    ElseIf cboAxisContent.Text = POWER Then
'
'   Check Y axis (power) range.
'
        If numyLow < 0 Or numyHigh > 1 Or Not (numyLow < numyHigh) Then
            Call PresentMessage(11)
            yLow.Text = Empty
            yHigh.Text = Empty
            Exit Sub
        End If
'
'   Set point on X axis (its minimum) where the Y axis intersects.
'
        Call SetYAxisIntersection(VtChartDetAlt, numxLow)
        Call plotDetAltPower(numxLow, numxHigh, numyLow, numyHigh)
    Else
        MsgBox "Must make x axis content selection"
    End If
'
'   Make the chart visible.
'
    VtChartDetAlt.Footnote.Location.Visible = False
    VtChartDetAlt.Visible = True
'
'   Make the appropriate plotchange boxes visible.
'
    Call enable_plotchange
    lblPlotAtRemind.Visible = True
'
'  In the legend the lines should be labeled with the
'  value of the variable being changed.  Do that here.
'
    If numSeriesCount > 1 Then
        Call legend_set(VtChartDetAlt, PlotChangeVar, PlotChangePrevValue, PlotChangeValue, numSeriesCount)
'        VtChartDetAlt.Column = 1
'        VtChartDetAlt.ColumnLabel = Format(PlotChangePrevValue)
'        VtChartDetAlt.Column = (numSeriesCount * 2) - 1
'        VtChartDetAlt.ColumnLabel = Format(PlotChangeValue)
'        VtChartDetAlt.Footnote.Location.LocationType = VtChLocationTypeRight
'        VtChartDetAlt.Footnote.Text = PlotChangeVar
'        VtChartDetAlt.Footnote.Location.Visible = True
    End If
'
'   If we are displaying only one line then turn off the legend.
'
    If numSeriesCount = 1 Then
        VtChartDetAlt.Legend.Location.Visible = False
    End If
'
'   Write a log file note if enabled.
'
    VtChartDetAlt.Tag = numSeriesCount
    Call write_graph_log(Me, VtChartDetAlt, "alpha=" + Format(ALPHA) + _
    " power=" + Format(numPower) + " lambda=" + Format(lambda) + " sigma=" + _
    Format(SIGMA) + " N=" + Format(N) + " sx(0)=" + Format(SX(0)) + _
                vbCrLf + _
    VtChartDetAlt.Plot.Axis(VtChAxisIdX, 1).AxisTitle.Text + " range:" + Format(numxLow) + " - " + Format(numxHigh) + " " + _
        vbCrLf + _
    VtChartDetAlt.Plot.Axis(VtChAxisIdY, 1).AxisTitle.Text + " range:" + Format(numyLow) + " - " + Format(numyHigh))

    
    xLow.Enabled = False
    xHigh.Enabled = False
    yLow.Enabled = False
    yHigh.Enabled = False
    cboAxisContent.Enabled = False
End Sub

Private Sub btnPrint_Click()
    VtChartDetAlt.PrintSetupDialog
End Sub

Private Sub btnSave_Click()
On Error GoTo errhndl
    With dialogSaveAs
      .DialogTitle = "Save Graph to Metafile (*.wmf)"
      .DefaultExt = "wmf"
      .Filter = "Metafiles|*.wmf"
      .Flags = cdlOFNHideReadOnly + cdlOFNOverwritePrompt
      .CancelError = True
      .InitDir = App.Path
      .ShowSave
      
      VtChartDetAlt.WritePictureToFile .Filename, VtPictureTypeWMF, 0
      If LogEnabled Then Call graph_saved_log(.Filename)
   End With
Exit Sub
errhndl:
If ERR.Number <> cdlCancel Then Error ERR.Number
Exit Sub
End Sub

Private Sub cboAxisContent_Click()
'
'   Enable data entry.
'
    Call EnableGraphControls(Me)
'
'  Clear the graph control.
'
    VtChartDetAlt.DataGrid.ColumnCount = 0
    VtChartDetAlt.DataGrid.RowCount = 0
'
'  Initialize counts.
'
    numSeriesCount = 0
    'SeriesCount.Text = Format(numSeriesCount)
    PlotAtChangeFlag = True
    maxRowCount = 0
    
    If cboAxisContent.Text = POWER Then
        With VtChartDetAlt
            .Plot.Axis(VtChAxisIdY, 1).AxisTitle.Text = POWER
        End With
'        lblplotAtValue.Caption = "Plot at what sample size?"
'        plotAtValue.Text = frmMain.LR1N.Text
        lblyRange.Caption = "Y axis range (power)"
        yLow.Text = "0"
        yHigh.Text = "1"
    Else 'cboAxisContent.Text = SS
        With VtChartDetAlt
            .Plot.Axis(VtChAxisIdY, 1).AxisTitle.Text = "Experimental" + ss
        End With
'        lblplotAtValue.Caption = "Plot at what power level?"
'        plotAtValue.Text = frmMain.LR1Power.Text
        lblyRange.Caption = "Y axis range (sample size)"
        yLow.Text = "0"
        yHigh.Text = Empty
    End If
    
'    lblplotAtValue.Visible = True
'    lblPlotAtRemind.Visible = True
'    plotAtValue.Visible = True
End Sub

Private Sub Form_Load()
    lblPlotAtRemind.Visible = False
    lblPlotAtRemind.Caption = constRemind
'
'  Load pointer properties for labels.
'
    Call SetLabelChars(Me)
'
'  Set pointers to help for the fields on the form.
'
    Me.lblgraph(0).WhatsThisHelpID = 360
    Me.lblgraph(1).WhatsThisHelpID = 388
    Me.lblgraph(2).WhatsThisHelpID = 386
'
'  Set the non-changing characteristics of the graph.
'
    Call SetGraphDefaults(Me.VtChartDetAlt)
    VtChartDetAlt.Plot.Axis(VtChAxisIdX, 1).AxisTitle.Text = "Difference in slope"
'    With VtChartDetAlt
'        .ToDefaults
'        .chartType = VtChChartType2dXY
'        .RandomFill = False
'        .Plot.UniformAxis = False
'        .Plot.Axis(VtChAxisIdX, 1).AxisTitle.Text = "Difference in slope"
'        .Plot.Axis(VtChAxisIdX, 1).AxisTitle.TextLayout.Orientation = VtOrientationHorizontal
'        .Plot.Axis(VtChAxisIdY, 1).AxisTitle.TextLayout.Orientation = VtOrientationUp
'        .DataGrid.ColumnCount = 0
'        .DataGrid.RowCount = 0
'    End With
'
'  Load combo box choices
'
    cboAxisContent.AddItem ss
    cboAxisContent.AddItem POWER
'
'  Extract data from calling form.
'
    If IsNumeric(frmMain.LR1Alpha.Text) Then ALPHA = CSng(frmMain.LR1Alpha.Text)
    If IsNumeric(frmMain.LR1Power.Text) Then numPower = CSng(frmMain.LR1Power.Text)
    If IsNumeric(frmMain.LR1Lambda.Text) Then lambda = CSng(frmMain.LR1Lambda.Text)
    If IsNumeric(frmMain.LR1Sigma.Text) Then SIGMA = CSng(frmMain.LR1Sigma.Text)
    If IsNumeric(frmMain.LR1N.Text) Then N = CSng(frmMain.LR1N.Text)
    If IsNumeric(frmMain.LR1SD.Text) Then SX(0) = CSng(frmMain.LR1SD.Text)
    
    LR1Alpha.Text = frmMain.LR1Alpha.Text
    LR1Power.Text = frmMain.LR1Power.Text
    LR1Lambda.Text = frmMain.LR1Lambda.Text
    LR1Sigma.Text = frmMain.LR1Sigma.Text
    LR1N.Text = frmMain.LR1N.Text
    LR1SD.Text = frmMain.LR1SD.Text
    
    LR1Alpha.Tag = 1
    LR1Power.Tag = 1
    LR1Lambda.Tag = 1
    LR1Sigma.Tag = 1
    LR1N.Tag = 1
    LR1SD.Tag = 1
'
'  Initialize count of series plotted.
'
    numSeriesCount = 0
    'SeriesCount.Text = Format(numSeriesCount)
'
'  PlotAtChangeFlag indicates whether the plotAtValue value has been changed
'  since the graph was last drawn.
'
    PlotAtChangeFlag = True
    
    maxRowCount = 0
'
'   Initially disable data entry.
'
    Call DisableGraphControls(Me)
'
'   Initially disable the buttons.
'
    Call DisableGraphButtons(Me)
'
'    Center the form on the screen.
'
    Call CenterForm(Me)
'
'   If necessary, scale the form to fit the current resolution.
'
    Call Resize_at_Form_Load(Me)
End Sub

Private Sub lblgraph_Click(Index As Integer)
     Call DisplayHelp(lblgraph(Index).WhatsThisHelpID)

End Sub

Private Sub mnuGraphics_Click()
    ShowHelpMapNumber 1, 392
End Sub

'Private Sub plotAtValue_Change()
'    PlotAtChangeFlag = True
'    numPlotAt = csng(plotAtValue.Text)
'End Sub

Private Sub plotDetAltSS(numxLow As Single, numxHigh As Single, numyLow As Single, numyHigh As Single)
Dim yvalue As Single, row As Integer, col As Integer
Dim diffValue As Single
Dim ALT As Long, i As Integer, j As Integer
Dim xLow As Single, xHigh As Single
Dim STEP As Single
Dim LastValue As Single

On Error GoTo ErrorHandler
'
'  Copy x range to local variables.
'
    xLow = numxLow
    xHigh = numxHigh
'
'  Check for illegal low end of range value.
'
    If xLow = 0 Then xLow = 0.001
'
'  Calculate step size.
'
    STEP = 0.01 * (xHigh - xLow)

    numTreat = 1
    
    With VtChartDetAlt
        .RowCount = numMax((numxHigh - numxLow + 1) * (1# / STEP), maxRowCount)
        .ColumnCount = numSeriesCount * 2
        .Column = (numSeriesCount * 2) - 1
'        .ColumnLabel = "x" + Format(numPlotAt)
'        .ColumnLabel = "Power = " + Format(numPlotAt)
        row = 0
               
        LastValue = Null
        For diffValue = xLow To xHigh Step STEP
            If Abs(diffValue) < epsilon Then
                yvalue = -999
            Else
                yvalue = LSAMPLESIZE(numTreat, XBAR(0), SX(0), SLOPES, ALPHA, numPower, diffValue, SIGMA, D_LAMBDA, M, D_GAMMA)
            End If
'
'   A negative resurn value indicates an error.  In that case ignore
'   the point.
'
            If yvalue > 0 And yvalue <> LastValue Then
'
'   If sample size result is beyond the specified range of the y axis truncate it.
'
'                If yvalue > numyHigh Then
'                    yvalue = numyHigh + (numyHigh * 0.1)
'                ElseIf yvalue < numyLow Then
'                    yvalue = numyLow - (numyLow * 0.01)
'                End If
                row = row + 1
                ' first column of the pair is the x value
                .Column = (numSeriesCount * 2) - 1
                .row = row
                .Data = diffValue
                ' second column of the pair is the y value
                .Column = numSeriesCount * 2
                .row = row
                .Data = yvalue
            End If
            LastValue = yvalue
        Next diffValue
        .Plot.Axis(VtChAxisIdY).ValueScale.Auto = False
        .Plot.Axis(VtChAxisIdY).ValueScale.Minimum = numyLow
        .Plot.Axis(VtChAxisIdY).ValueScale.Maximum = numyHigh
        
        If row = 0 Then row = 1
        realRowCount(numSeriesCount) = row
        If row > maxRowCount Then maxRowCount = row
'
'  Clear out the cells in series that are shorter than the maximum.
'
        For i = 1 To numSeriesCount
            If realRowCount(i) < maxRowCount Then
                For j = realRowCount(i) + 1 To maxRowCount
                    .Column = (i * 2) - 1
                    .row = j
                    .Data = Empty
                    
                    .Column = i * 2
                    .row = j
                    .Data = Empty
                Next j
            End If
        Next i
        .RowCount = maxRowCount
    End With
Exit Sub
ErrorHandler:
    yvalue = -999
    Resume Next
End Sub
Private Sub plotDetAltPower(numxLow As Single, numxHigh As Single, numyLow As Single, numyHigh As Single)
Dim yvalue As Single, row As Integer, col As Integer
Dim diffValue As Single
Dim ALT As Long, i As Integer, j As Integer
Dim STEP As Single

On Error GoTo ErrorHandler
'
'  Check for illegal low end of range value.
'
    If xLow = 0 Then xLow = 0.001
'
'  Calculate step size.
'
    STEP = 0.01 * (xHigh - xLow)
    
    With VtChartDetAlt
        .RowCount = numMax((numxHigh - numxLow + 1) * (1# / STEP), maxRowCount)
        .ColumnCount = numSeriesCount * 2
        .Column = (numSeriesCount * 2) - 1
'        .ColumnLabel = "x" + Format(numPlotAt)
'        .ColumnLabel = "Sample size = " + Format(numPlotAt)
        
        row = 0
        numTreat = 1
               
        For diffValue = numxLow To numxHigh Step STEP
            If Abs(diffValue) < epsilon Then
                yvalue = -999
            Else
                yvalue = LPOWER(numTreat, XBAR(0), SX(0), SLOPES, ALPHA, diffValue, SIGMA, N, D_LAMBDA, M, D_GAMMA)
            End If
'
'   A negative return value indicates an error.  Ignore the point if
'   that is the case.
'
            If yvalue > 0 Then
'
'   If sample size result is beyond the specified range of the y axis truncate it.
'
'                If yvalue > numyHigh Then
'                    yvalue = numyHigh + (numyHigh * 0.1)
'                ElseIf yvalue < numyLow Then
'                    yvalue = numyLow - (numyLow * 0.01)
'                End If
                row = row + 1
                ' first column of the pair is the x value
                .Column = (numSeriesCount * 2) - 1
                .row = row
                .Data = diffValue
                ' second column of the pair is the y value
                .Column = numSeriesCount * 2
                .row = row
                .Data = yvalue
            End If
        Next diffValue
        .Plot.Axis(VtChAxisIdY).ValueScale.Auto = False
        .Plot.Axis(VtChAxisIdY).ValueScale.Minimum = numyLow
        .Plot.Axis(VtChAxisIdY).ValueScale.Maximum = numyHigh
        
        If row = 0 Then row = 1
        realRowCount(numSeriesCount) = row
        If row > maxRowCount Then maxRowCount = row
'
'  Clear out the cells in series that are shorter than the maximum.
'
        For i = 1 To numSeriesCount
            If realRowCount(i) < maxRowCount Then
                For j = realRowCount(i) + 1 To maxRowCount
                    .Column = (i * 2) - 1
                    .row = j
                    .Data = Empty
                    
                    .Column = i * 2
                    .row = j
                    .Data = Empty
                Next j
            End If
        Next i
        .RowCount = maxRowCount
    End With
Exit Sub
ErrorHandler:
    yvalue = -999
    Resume Next
End Sub

'Private Sub plotAtValue_LostFocus()
'    Call CheckNumeric(frmLR1DetAltGraph.plotAtValue)
'End Sub

Private Sub xHigh_LostFocus()
    Call CheckNumeric(frmLR1DetAltGraph.xHigh)
End Sub

Private Sub xLow_LostFocus()
    Call CheckNumeric(frmLR1DetAltGraph.xLow)
End Sub

Private Sub yHigh_LostFocus()
    Call CheckNumeric(frmLR1DetAltGraph.yHigh)
End Sub

Private Sub yLow_LostFocus()
    Call CheckNumeric(frmLR1DetAltGraph.yLow)
End Sub
Private Sub mnuAboutPS_Click()
    ShowHelpMapNumber 1, 302
End Sub

Private Sub mnuExit_Click()
    Call btnExit_Click
End Sub

Private Sub mnuHelpContents_Click()
    ShowHelpMapNumber 1, 300
End Sub

Private Sub mnuOverview_Click()
    ShowHelpMapNumber 1, 511
End Sub

Private Sub mnuPrint_Click()
    Call btnPrint_Click
End Sub

Private Sub mnuSave_Click()
    Call btnSave_Click
End Sub

'Private Sub lblFootnoteDefinition_Click()
'    ' Call DisplayHelp(frmMain.lblLR1Input.WhatsThisHelpID)
'End Sub

'Private Sub lblplotAtValue_Click()
'    ' Call DisplayHelp(lblplotAtValue.WhatsThisHelpID)
'
'End Sub


Private Sub lblyRange_Click()
    ' Call DisplayHelp(lblyRange.WhatsThisHelpID)
        ShowHelpMapNumber 1, 390
End Sub
Private Sub enable_plotchange()

    LR1Alpha.Visible = frmMain.LR1Alpha.Visible
    LR1Power.Visible = frmMain.LR1Power.Visible
    LR1Lambda.Visible = frmMain.LR1Lambda.Visible
    LR1Sigma.Visible = frmMain.LR1Sigma.Visible
    LR1N.Visible = frmMain.LR1N.Visible
    LR1SD.Visible = frmMain.LR1SD.Visible
    
    lblLR1Alpha.Visible = frmMain.LR1Alpha.Visible
    lblLR1Power.Visible = frmMain.LR1Power.Visible
    lblLR1Lambda.Visible = frmMain.LR1Lambda.Visible
    lblLR1Sigma.Visible = frmMain.LR1Sigma.Visible
    lblLR1N.Visible = frmMain.LR1N.Visible
    lblLR1SD.Visible = frmMain.LR1SD.Visible
    lblLR1SDx.Visible = frmMain.LR1SD.Visible
    
    If LR1Alpha.Tag = 0 Then LR1Alpha.Enabled = False
    If LR1Power.Tag = 0 Then LR1Power.Enabled = False
    If LR1Lambda.Tag = 0 Then LR1Lambda.Enabled = False
    If LR1Sigma.Tag = 0 Then LR1Sigma.Enabled = False
    If LR1N.Tag = 0 Then LR1N.Enabled = False
    If LR1SD.Tag = 0 Then LR1SD.Enabled = False
    LR1Alpha.Tag = 0
    LR1Power.Tag = 0
    LR1Lambda.Tag = 0
    LR1Sigma.Tag = 0
    LR1N.Tag = 0
    LR1SD.Tag = 0

    If cboAxisContent.Text = ss Then
        LR1N.Enabled = False
    ElseIf cboAxisContent.Text = POWER Then
        LR1Power.Enabled = False
    End If

End Sub

