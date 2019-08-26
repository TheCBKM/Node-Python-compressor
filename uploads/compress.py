from PIL import Image
import sys
try:
    foo = Image.open("./uploads/"+sys.argv[1])

    foo.save('uploads/'+sys.argv[1],quality=20,optimize=True)  
    print("Done")
except:
    print("exception")
