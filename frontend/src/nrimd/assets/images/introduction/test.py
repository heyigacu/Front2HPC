# from PIL import Image



# import imageio
# from PIL import Image

# from PIL import Image, ImageSequence

# def reverse_gif(gif_path, reverse_gif_path):
#     gif = Image.open(gif_path)
#     num_frames = gif.n_frames
#     width, height = gif.size
#     reversed_frames = []
#     for i in range(0, num_frames, 1):
#         gif.seek(i)
#         frame = gif.copy()
#         reversed_frames.append(frame)
#     for i in range(num_frames-1, -1, -1):
#         gif.seek(i)
#         frame = gif.copy()
#         reversed_frames.append(frame)
#     reversed_gif = Image.new("RGBA", (width, height))
#     reversed_gif.save(reverse_gif_path, save_all=True, append_images=reversed_frames, loop=0)




# gif_path = "/home/hy/Documents/Project/NRIMD/NRIMD3/frontend/src/nrimd/assets/images/introduction/membrane.gif"
# circular_gif_path = "/home/hy/Documents/Project/NRIMD/NRIMD3/frontend/src/nrimd/assets/images/introduction/membrane_circular.gif"

# reverse_gif(gif_path, circular_gif_path)


from PIL import Image, ImageSequence, ImageFilter
# 打开GIF图像
image = Image.open("/home/hy/Documents/Project/NRIMD/NRIMD3/frontend/src/nrimd/assets/images/introduction/membrane.gif")
# 创建一个新的GIF序列，并复制原始图像的帧数、大小和延迟时间
frames = []
for frame in ImageSequence.Iterator(image):
    new_frame = Image.new("RGBA", frame.size)
    new_frame.paste(frame)
    frames.append(new_frame)
# 对每个帧进行去噪处理
denoised_frames = []
for frame in frames:
    denoised_frame = frame.filter(ImageFilter.GaussianBlur(radius=3))
    # 在此处可以添加其他去噪算法或滤波器
    denoised_frames.append(denoised_frame)
# 创建输出GIF
output_image = "/home/hy/Documents/Project/NRIMD/NRIMD3/frontend/src/nrimd/assets/images/introduction/membrane-denoise.gif"
denoised_frames[0].save(output_image, save_all=True, append_images=denoised_frames[1:], loop=0)
print("去噪完成并保存到output.gif")